package common

import (
	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/models"
)

func ServicePreDeploy(kubeService *v1.Service, cluster *models.Cluster, namespace *models.Namespace) {
	preDefinedAnnotationMap := make(map[string]string)

	annotationResult := make(map[string]string, 0)
	// user defined
	for k, v := range kubeService.Annotations {
		preDefinedAnnotationMap[k] = v
	}
	// cluster defined, overwrite user defined
	for k, v := range cluster.MetaDataObj.ServiceAnnotations {
		preDefinedAnnotationMap[k] = v
	}
	// namespace defined, overwrite cluster and user defined
	for k, v := range namespace.MetaDataObj.ServiceAnnotations {
		preDefinedAnnotationMap[k] = v
	}
	for k, v := range preDefinedAnnotationMap {
		annotationResult[k] = v
	}

	kubeService.Annotations = annotationResult
}
