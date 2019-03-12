package cronjob

import (
	"strings"

	batchv1beta1 "k8s.io/api/batch/v1beta1"
	"k8s.io/api/core/v1"

	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util"
)

func cronjobPreDeploy(kubeCronJob *batchv1beta1.CronJob, cronjob *models.Cronjob,
	cluster *models.Cluster, namespace *models.Namespace) {
	// step 1  add envs
	for i := 0; i < len(kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.Containers); i++ {
		preDefinedEnvMap := make(map[string]v1.EnvVar)

		envResult := make([]v1.EnvVar, 0)
		// user defined
		for _, env := range kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.Containers[i].Env {
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
		kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.Containers[i].Env = envResult

	}

	// step 2  add image pull secret
	preDefinedImagePullSecretMap := make(map[string]v1.LocalObjectReference)
	// user defined
	for _, secret := range kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.ImagePullSecrets {
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
	kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.ImagePullSecrets = imagePullSecretsResult

	// step 3  add user defined affinity
	if cronjob.MetaDataObj.Affinity != nil {
		kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.Affinity = cronjob.MetaDataObj.Affinity
	}
	// step 4  is allow privilege
	for i := 0; i < len(kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.Containers); i++ {
		if kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.Containers[i].SecurityContext == nil {
			kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.Containers[i].SecurityContext = &v1.SecurityContext{}
		}
		// 默认不允许特权模式
		privileged, ok := cronjob.MetaDataObj.Privileged[kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.Containers[i].Name]
		if !ok {
			falseVar := false
			privileged = &falseVar
		}
		kubeCronJob.Spec.JobTemplate.Spec.Template.Spec.Containers[i].SecurityContext.Privileged = privileged
	}
	// step 5 set namespace
	kubeCronJob.Namespace = namespace.KubeNamespace

	// step 6
	if kubeCronJob.Spec.JobTemplate.Spec.Template.Annotations == nil {
		kubeCronJob.Spec.JobTemplate.Spec.Template.Annotations = make(map[string]string)
	}
	kubeCronJob.Spec.JobTemplate.Spec.Template.Annotations[util.PodAnnotationControllerKindLabelKey] = strings.ToLower(string(models.KubeApiTypeCronJob))
}
