package maps

import (
	"fmt"
	"strings"
)

// merge label
// the new map will overwrite the old one.
// e.g. new: {"foo": "newbar"} old: {"foo": "bar"} will return {"foo": "newbar"}
func MergeLabels(old map[string]string, new map[string]string) map[string]string {
	if new == nil {
		return old
	}

	if old == nil {
		old = make(map[string]string)
	}

	for key, value := range new {
		old[key] = value
	}
	return old
}

func LabelsToString(labels map[string]string) string {
	result := make([]string, len(labels))
	for k, v := range labels {
		result = append(result, fmt.Sprintf("%s=%s", k, v))

	}

	return strings.Join(result, ",")
}
