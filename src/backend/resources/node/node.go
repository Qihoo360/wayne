package node

import (
	"sort"
	"strconv"

	"k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	"github.com/Qihoo360/wayne/src/backend/client"
)

type NodeStatistics struct {
	Total   int            `json:"total,omitempty"`
	Details map[string]int `json:"details,omitempty"`
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

func ListNode(indexer *client.CacheIndexer) ([]Node, error) {
	nodeList := indexer.Node.List()
	nodes := make([]Node, 0)
	for _, node := range nodeList {
		cacheNode, ok := node.(*v1.Node)
		if !ok {
			continue
		}
		nodes = append(nodes, toNode(*cacheNode))
	}

	sort.Slice(nodes, func(i, j int) bool {
		return nodes[i].Name < nodes[j].Name
	})

	return nodes, nil
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
