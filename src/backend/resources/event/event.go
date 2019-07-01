package event

import (
	"fmt"
	"sort"
	"strings"

	batchv1 "k8s.io/api/batch/v1"
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/types"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/client/api"
	basecommon "github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
	"github.com/Qihoo360/wayne/src/backend/resources/dataselector"
	"github.com/Qihoo360/wayne/src/backend/util/slice"
)

// FailedReasonPartials  is an array of partial strings to correctly filter warning events.
// Have to be lower case for correct case insensitive comparison.
// Based on k8s official events reason file:
// https://github.com/kubernetes/kubernetes/blob/886e04f1fffbb04faf8a9f9ee141143b2684ae68/pkg/kubelet/events/event.go
// Partial strings that are not in event.go file are added in order to support
// older versions of k8s which contained additional event reason messages.
var FailedReasonPartials = []string{"failed", "err", "exceeded", "invalid", "unhealthy",
	"mismatch", "insufficient", "conflict", "outof", "nil", "backoff"}

func GetPodsWarningEvents(indexer *client.CacheFactory, pods []*apiv1.Pod) ([]common.Event, error) {
	events, err := indexer.EventLister().List(labels.Everything())
	if err != nil {
		return nil, err
	}

	result := make([]common.Event, 0)

	// Filter out only warning events
	events = getWarningEvents(events)
	failedPods := make([]*apiv1.Pod, 0)

	// Filter out ready and successful pods
	for _, pod := range pods {
		if !isReadyOrSucceeded(pod) {
			failedPods = append(failedPods, pod)
		}
	}

	// Filter events by failed pods UID
	events = filterEventsByPodsUID(events, failedPods)
	events = removeDuplicates(events)

	for _, event := range events {
		result = append(result, common.Event{
			Message:         event.Message,
			Reason:          event.Reason,
			Type:            event.Type,
			FirstSeen:       event.FirstTimestamp,
			LastSeen:        event.LastTimestamp,
			Count:           event.Count,
			SourceComponent: event.Source.Component,
			Name:            event.InvolvedObject.Name,
		})
	}

	return result, nil
}

func getPodsWarningEventsPage(kubeClient client.ResourceHandler, pods []*apiv1.Pod) ([]common.Event, error) {
	eventObjs, err := kubeClient.List(api.ResourceNameEvent, "", labels.Everything().String())
	if err != nil {
		return nil, err
	}

	events := make([]*apiv1.Event, 0)
	for _, obj := range eventObjs {
		events = append(events, obj.(*apiv1.Event))
	}

	result := make([]common.Event, 0)

	// Filter out only warning events
	events = getWarningEvents(events)
	failedPods := make([]*apiv1.Pod, 0)

	// Filter out ready and successful pods
	for _, pod := range pods {
		if !isReadyOrSucceeded(pod) {
			failedPods = append(failedPods, pod)
		}
	}

	// Filter events by failed pods UID
	events = filterEventsByPodsUID(events, failedPods)
	events = removeDuplicates(events)

	for _, event := range events {
		result = append(result, common.Event{
			Message:         event.Message,
			Reason:          event.Reason,
			Type:            event.Type,
			FirstSeen:       event.FirstTimestamp,
			LastSeen:        event.LastTimestamp,
			Count:           event.Count,
			SourceComponent: event.Source.Component,
			Name:            event.InvolvedObject.Name,
		})
	}

	return result, nil
}

func GetPodsEventByCronJobPage(kubeClient client.ResourceHandler, namespace, name string, q *basecommon.QueryParam) (*basecommon.Page, error) {
	jobs, err := kubeClient.List(api.ResourceNameJob, namespace, labels.Everything().String())
	if err != nil {
		return nil, err
	}
	relateJobs := make([]string, 0)
	for _, obj := range jobs {
		job, ok := obj.(*batchv1.Job)
		if !ok {
			return nil, fmt.Errorf("Convert rs obj (%v) error. ", obj)
		}
		for _, ref := range job.OwnerReferences {
			if ref.Kind == api.KindNameCronJob && ref.Name == name {
				relateJobs = append(relateJobs, job.Name)
			}
		}

	}
	pods, err := kubeClient.List(api.ResourceNamePod, namespace, labels.Everything().String())
	if err != nil {
		return nil, err
	}
	relatePod := make([]*apiv1.Pod, 0)
	for _, obj := range pods {
		pod, ok := obj.(*apiv1.Pod)
		if !ok {
			return nil, fmt.Errorf("Convert pod obj (%v) error. ", obj)
		}
		for _, ref := range pod.OwnerReferences {
			if ref.Kind == api.KindNameJob && slice.StrSliceContains(relateJobs, ref.Name) {
				relatePod = append(relatePod, pod)
			}
		}

	}

	events, err := getPodsWarningEventsPage(kubeClient, relatePod)
	if err != nil {
		return nil, err
	}

	return pageResult(events, q), nil
}

func pageResult(events []common.Event, q *basecommon.QueryParam) *basecommon.Page {
	commonObjs := make([]dataselector.DataCell, 0)
	for _, event := range events {
		commonObjs = append(commonObjs, ObjectCell(event))
	}

	sort.Slice(commonObjs, func(i, j int) bool {
		return commonObjs[j].GetProperty(dataselector.CreationTimestampProperty).
			Compare(commonObjs[i].GetProperty(dataselector.CreationTimestampProperty)) == -1
	})

	return dataselector.DataSelectPage(commonObjs, q)
}

// Returns filtered list of event objects.
// Event list object is filtered to get only warning events.
func getWarningEvents(events []*apiv1.Event) []*apiv1.Event {
	if !IsTypeFilled(events) {
		events = FillEventsType(events)
	}

	return filterEventsByType(events, apiv1.EventTypeWarning)
}

// IsTypeFilled returns true if all given events type is filled, false otherwise.
// This is needed as some older versions of kubernetes do not have Type property filled.
func IsTypeFilled(events []*apiv1.Event) bool {
	if len(events) == 0 {
		return false
	}

	for _, event := range events {
		if len(event.Type) == 0 {
			return false
		}
	}

	return true
}

// Based on event Reason fills event Type in order to allow correct filtering by Type.
func FillEventsType(events []*apiv1.Event) []*apiv1.Event {
	for i := range events {
		if isFailedReason(events[i].Reason, FailedReasonPartials...) {
			events[i].Type = apiv1.EventTypeWarning
		} else {
			events[i].Type = apiv1.EventTypeNormal
		}
	}

	return events
}

// Returns true if reason string contains any partial string indicating that this may be a
// warning, false otherwise
func isFailedReason(reason string, partials ...string) bool {
	for _, partial := range partials {
		if strings.Contains(strings.ToLower(reason), partial) {
			return true
		}
	}

	return false
}

// Filters kubernetes API event objects based on event type.
// Empty string will return all events.
func filterEventsByType(events []*apiv1.Event, eventType string) []*apiv1.Event {
	if len(eventType) == 0 || len(events) == 0 {
		return events
	}

	result := make([]*apiv1.Event, 0)
	for _, event := range events {
		if event.Type == eventType {
			result = append(result, event)
		}
	}

	return result
}

// Returns true if given pod is in state ready or succeeded, false otherwise
func isReadyOrSucceeded(pod *apiv1.Pod) bool {
	if pod.Status.Phase == apiv1.PodSucceeded {
		return true
	}
	if pod.Status.Phase == apiv1.PodRunning {
		for _, c := range pod.Status.Conditions {
			if c.Type == apiv1.PodReady {
				if c.Status == apiv1.ConditionFalse {
					return false
				}
			}
		}

		return true
	}

	return false
}

// Returns filtered list of event objects. Events list is filtered to get only events targeting
// pods on the list.
func filterEventsByPodsUID(events []*apiv1.Event, pods []*apiv1.Pod) []*apiv1.Event {
	result := make([]*apiv1.Event, 0)
	podEventMap := make(map[types.UID]bool, 0)

	if len(pods) == 0 || len(events) == 0 {
		return result
	}

	for _, pod := range pods {
		podEventMap[pod.UID] = true
	}

	for _, event := range events {
		if _, exists := podEventMap[event.InvolvedObject.UID]; exists {
			result = append(result, event)
		}
	}

	return result
}

// Removes duplicate strings from the slice
func removeDuplicates(slice []*apiv1.Event) []*apiv1.Event {
	visited := make(map[string]bool, 0)
	result := make([]*apiv1.Event, 0)

	for _, elem := range slice {
		if !visited[elem.Reason] {
			visited[elem.Reason] = true
			result = append(result, elem)
		}
	}

	return result
}
