export class Permission {
  id: number;
  name: string;
  comment: string;
  type: string;
}

export class ActionPermission {
  read = false;
  create = false;
  update = false;
  delete = false;
}

export class TypePermission {
  app = new ActionPermission();
  appUser = new ActionPermission();
  namespace = new ActionPermission();
  namespaceUser = new ActionPermission();
  deployment = new ActionPermission();
  secret = new ActionPermission();
  service = new ActionPermission();
  ingress = new ActionPermission();
  pvc = new ActionPermission();
  configmap = new ActionPermission();
  cronjob = new ActionPermission();
  webHook = new ActionPermission();
  statefulset = new ActionPermission();
  apiKey = new ActionPermission();
  daemonSet = new ActionPermission();
  hpa = new ActionPermission();

  // Kubernetes resource permission
  kubeConfigMap = new ActionPermission();
  kubeDaemonSet = new ActionPermission();
  kubeDeployment = new ActionPermission();
  kubeEvent = new ActionPermission();
  kubeHorizontalPodAutoscaler = new ActionPermission();
  kubeIngress = new ActionPermission();
  kubeJob = new ActionPermission();
  kubeCronJob = new ActionPermission();
  kubeNamespace = new ActionPermission();
  kubeNode = new ActionPermission();
  kubePersistentVolumeClaim = new ActionPermission();
  kubePersistentVolume = new ActionPermission();
  kubePod = new ActionPermission();
  kubeReplicaSet = new ActionPermission();
  kubeSecret = new ActionPermission();
  kubeService = new ActionPermission();
  kubeStatefulSet = new ActionPermission();
  kubeEndpoint = new ActionPermission();
  kubeStorageClass = new ActionPermission();
  kubeRole = new ActionPermission();
  kubeRoleBinding = new ActionPermission();
  kubeClusterRole = new ActionPermission();
  kubeClusterRoleBinding = new ActionPermission();
  kubeServiceAccount = new ActionPermission();

}
