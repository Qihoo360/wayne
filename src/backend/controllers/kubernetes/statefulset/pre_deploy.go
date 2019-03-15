package statefulset

import (
	"strings"

	"k8s.io/api/apps/v1beta1"
	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util"
)

func statefulsetPreDeploy(kubeStatefulSet *v1beta1.StatefulSet, statefulSet *models.Statefulset,
	cluster *models.Cluster, namespace *models.Namespace) {
	// step 1  add envs
	for i := 0; i < len(kubeStatefulSet.Spec.Template.Spec.Containers); i++ {
		preDefinedEnvMap := make(map[string]v1.EnvVar)

		envResult := make([]v1.EnvVar, 0)
		// user defined
		for _, env := range kubeStatefulSet.Spec.Template.Spec.Containers[i].Env {
			preDefinedEnvMap[env.Name] = env
		}
		// cluster defined, overwrite user defined
		for _, env := range cluster.MetaDataObj.Env {
			preDefinedEnvMap[env.Name] = env
		}
		// namespace defined, overwrite cluster and user defined
		for _, env := range namespace.MetaDataObj.Env {
			preDefinedEnvMap[env.Name] = env
		}
		for _, env := range preDefinedEnvMap {
			envResult = append(envResult, env)
		}
		kubeStatefulSet.Spec.Template.Spec.Containers[i].Env = envResult

	}

	// step 2  add image pull secret
	preDefinedImagePullSecretMap := make(map[string]v1.LocalObjectReference)
	// user defined
	for _, secret := range kubeStatefulSet.Spec.Template.Spec.ImagePullSecrets {
		preDefinedImagePullSecretMap[secret.Name] = secret
	}
	// cluster defined, overwrite user defined
	for _, secret := range cluster.MetaDataObj.ImagePullSecrets {
		preDefinedImagePullSecretMap[secret.Name] = secret
	}
	// namespace defined, overwrite cluster and user defined
	for _, secret := range namespace.MetaDataObj.ImagePullSecrets {
		preDefinedImagePullSecretMap[secret.Name] = secret
	}
	imagePullSecretsResult := make([]v1.LocalObjectReference, 0)
	for _, secret := range preDefinedImagePullSecretMap {
		imagePullSecretsResult = append(imagePullSecretsResult, secret)
	}
	kubeStatefulSet.Spec.Template.Spec.ImagePullSecrets = imagePullSecretsResult

	// step 3  add user defined affinity
	if statefulSet.MetaDataObj.Affinity != nil {
		kubeStatefulSet.Spec.Template.Spec.Affinity = statefulSet.MetaDataObj.Affinity
	}
	// step 4  is allow privilege
	for i := 0; i < len(kubeStatefulSet.Spec.Template.Spec.Containers); i++ {
		if kubeStatefulSet.Spec.Template.Spec.Containers[i].SecurityContext == nil {
			kubeStatefulSet.Spec.Template.Spec.Containers[i].SecurityContext = &v1.SecurityContext{}
		}
		// 默认不允许特权模式
		privileged, ok := statefulSet.MetaDataObj.Privileged[kubeStatefulSet.Spec.Template.Spec.Containers[i].Name]
		if !ok {
			falseVar := false
			privileged = &falseVar
		}
		kubeStatefulSet.Spec.Template.Spec.Containers[i].SecurityContext.Privileged = privileged
	}
	// step 5 set namespace
	kubeStatefulSet.Namespace = namespace.KubeNamespace

	// step 6
	if kubeStatefulSet.Spec.Template.Annotations == nil {
		kubeStatefulSet.Spec.Template.Annotations = make(map[string]string)
	}
	kubeStatefulSet.Spec.Template.Annotations[util.PodAnnotationControllerKindLabelKey] = strings.ToLower(string(models.KubeApiTypeStatefulSet))
}
