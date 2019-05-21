package dataselector

// PropertyName is used to get the value of certain property of data cell.
// For example if we want to get the namespace of certain Deployment we can use DeploymentCell.GetProperty(NamespaceProperty)
type PropertyName string

// List of all property names supported by the UI.
const (
	NameProperty              PropertyName = "name"
	CreationTimestampProperty PropertyName = "creationTimestamp"
	NamespaceProperty         PropertyName = "namespace"
	StatusProperty            PropertyName = "status"

	// Pod Property
	PodIPProperty    PropertyName = "podIP"
	NodeNameProperty PropertyName = "nodeName"
)
