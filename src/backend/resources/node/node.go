package node

import (
	"sort"
	"strconv"

	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
	"github.com/Qihoo360/wayne/src/backend/resources/common"
)

type NodeStatistics struct {
	Total   int            `json:"total,omitempty"`
	Details map[string]int `json:"details,omitempty"`
}

type NodeListResult struct {
	NodeSummary   NodeListSummary `json:"nodeSummary"`
	CpuSummary    ResourceSummary `json:"cpuSummary"`
	MemorySummary ResourceSummary `json:"memorySummary"`
	Nodes         []Node          `json:"nodes"`
}

type NodeListSummary struct {
	// total nodes count
	Total int64
	// ready nodes count
	Ready int64
	// Schedulable nodes count
	Schedulable int64
}

type ResourceSummary struct {
	Total int64
	Used  int64
}

type Node struct {
	Name              string            `json:"name,omitempty"`
	Labels            map[string]string `json:"labels,omitempty"`
	CreationTimestamp metaV1.Time       `json:"creationTimestamp"`

	Spec NodeSpec `json:"spec,omitempty"`

	Status NodeStatus `json:"status,omitempty"`
}

type NodeSpec struct {
	Unschedulable bool `json:"unschedulable"`
	// If specified, the node's taints.
	// +optional
	Taints []v1.Taint         `json:"taints,omitempty"`
	Ready  v1.ConditionStatus `json:"ready"`
}

type NodeStatus struct {
	Capacity map[v1.ResourceName]string `json:"capacity,omitempty"`
	NodeInfo v1.NodeSystemInfo          `json:"nodeInfo,omitempty"`
}

func GetNodeCounts(indexer *client.CacheIndexer) (int, error) {
	nodeList := indexer.Node.List()
	return len(nodeList), nil
}

func ListNode(indexer *client.CacheIndexer) (NodeListResult, error) {
	nodeList := indexer.Node.List()
	nodes := make([]Node, 0)
	ready := 0
	schedulable := 0

	// unit m  1 core = 1000m
	var avaliableCpu int64 = 0
	// unit Byte
	var avaliableMemory int64 = 0

	avaliableNodeMap := make(map[string]*v1.Node)

	for _, node := range nodeList {
		cacheNode, ok := node.(*v1.Node)
		if !ok {
			continue
		}
		isReady := false
		isSchedulable := false
		for _, condition := range cacheNode.Status.Conditions {
			if condition.Type == v1.NodeReady && condition.Status == v1.ConditionTrue {
				ready += 1
				isReady = true
			}

		}
		if !cacheNode.Spec.Unschedulable {
			schedulable += 1
			isSchedulable = true
		}

		if isReady && isSchedulable {
			avaliableNodeMap[cacheNode.Name] = cacheNode

			cpuQuantity := cacheNode.Status.Allocatable[v1.ResourceCPU]
			memoryQuantity := cacheNode.Status.Allocatable[v1.ResourceMemory]
			// unit m
			avaliableCpu += cpuQuantity.MilliValue()
			// unit Byte
			avaliableMemory += memoryQuantity.Value()
		}

		nodes = append(nodes, toNode(*cacheNode))
	}

	sort.Slice(nodes, func(i, j int) bool {
		return nodes[i].Name < nodes[j].Name
	})

	resourceList := podUsedResourcesOnAvaliableNode(indexer, avaliableNodeMap)

	return NodeListResult{
		NodeSummary: NodeListSummary{
			Total:       int64(len(nodes)),
			Ready:       int64(ready),
			Schedulable: int64(schedulable),
		},
		CpuSummary: ResourceSummary{
			Total: avaliableCpu / 1000,
			Used:  resourceList.Cpu / 1000,
		},
		MemorySummary: ResourceSummary{
			Total: avaliableMemory / (1024 * 1024 * 1024),
			Used:  resourceList.Memory / (1024 * 1024 * 1024),
		},
		Nodes: nodes,
	}, nil
}

func podUsedResourcesOnAvaliableNode(indexer *client.CacheIndexer, avaliableNodeMap map[string]*v1.Node) common.ResourceList {
	result := common.ResourceList{}
	cachePods := indexer.Pod.List()
	for _, p := range cachePods {
		cachePod, ok := p.(*v1.Pod)
		if !ok {
			continue
		}

		// Exclude Pod on Unavailable Node
		_, ok = avaliableNodeMap[cachePod.Spec.NodeName]
		if cachePod.Status.Phase == v1.PodFailed || cachePod.Status.Phase == v1.PodSucceeded || cachePod.DeletionTimestamp != nil || !ok {
			continue
		}

		resourceList := common.ContainersResourceList(cachePod.Spec.Containers)

		result.Cpu += resourceList.Cpu
		result.Memory += resourceList.Memory
	}

	return result
}

func toNode(knode v1.Node) Node {

	node := Node{
		Name:              knode.Name,
		Labels:            knode.Labels,
		CreationTimestamp: knode.CreationTimestamp,
		Spec: NodeSpec{
			Unschedulable: knode.Spec.Unschedulable,
			Taints:        knode.Spec.Taints,
		},
		Status: NodeStatus{
			NodeInfo: knode.Status.NodeInfo,
		},
	}

	capacity := make(map[v1.ResourceName]string)

	for resourceName, value := range knode.Status.Capacity {
		if resourceName == v1.ResourceCPU {
			// cpu unit core
			capacity[resourceName] = strconv.Itoa(int(value.Value()))
		}
		if resourceName == v1.ResourceMemory {
			// memory unit Gi
			capacity[resourceName] = strconv.Itoa(int(value.Value() / (1024 * 1024 * 1024)))
		}
	}
	node.Status.Capacity = capacity

	for _, condition := range knode.Status.Conditions {
		if condition.Type == v1.NodeReady {
			node.Spec.Ready = condition.Status
		}
	}

	return node
}

func UpdateNode(cli *kubernetes.Clientset, node *v1.Node) (*v1.Node, error) {
	newNode, err := cli.CoreV1().Nodes().Update(node)
	if err != nil {
		return nil, err
	}
	return newNode, nil
}

func DeleteNode(cli *kubernetes.Clientset, name string) error {
	return cli.CoreV1().Nodes().Delete(name, &metaV1.DeleteOptions{})
}

func GetNodeByName(cli *kubernetes.Clientset, name string) (*v1.Node, error) {
	return cli.CoreV1().
		Nodes().
		Get(name, metaV1.GetOptions{})
}
