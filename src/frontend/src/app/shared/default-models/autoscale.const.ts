export const defaultAutoscale = `{
  "apiVersion": "autoscaling/v1",
  "kind": "HorizontalPodAutoscaler",
  "metadata": {
    "name": ""
  },
  "spec": {
    "maxReplicas": 3,
    "minReplicas": 1,
    "scaleTargetRef": {
        "apiVersion": "extensions/v1beta1",
        "kind": "Deployment",
        "name": ""
    },
    "targetCPUUtilizationPercentage": 80
  }
}`;
