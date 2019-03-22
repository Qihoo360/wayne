// tslint:disable:max-line-length
/**
 * 一共有3种类型
 * type SideNavType.NormalLink 不展开跳转链接
 * type SideNavType.GroupLink 存在展开的跳转
 * type SideNavType.Divider 分割线
 * 注意一点 link 必须统一不加 admin 前缀
 */
enum SideNavType {
  NormalLink, GroupLink, Divider
}

const adminSideNav: any[] = [
  { type: SideNavType.NormalLink, a: { link: 'reportform/overview', title: 'MENU.PLATFORM_OVERVIEW', text: 'MENU.PLATFORM_OVERVIEW', icon: { shape: 'help-info' } } },
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.CLUSTER', shape: 'cloud-scale' }, text: 'MENU.CLUSTER', child: [
      { a: { link: 'cluster', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'cluster/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { shape: 'world', title: 'Kubernetes', solid: true }, text: 'Kubernetes', child: [
      { a: { link: 'kubernetes/node', text: 'Node', options: {exact: false}, icon: { shape: 'devices', solid: false } } },
      { a: { link: 'kubernetes/namespace', text: 'Namespace', options: {exact: false}, icon: { shape: 'vmw-app', solid: true } } },
      { type: SideNavType.Divider },
      { a: { link: 'kubernetes/role', text: 'Role', options: {exact: false}, icon: { shape: 'assign-user' } } },
      { a: { link: 'kubernetes/clusterrole', text: 'ClusterRole', options: {exact: false}, icon: { shape: 'assign-user', solid: true } } },
      { a: { link: 'kubernetes/rolebinding', text: 'RoleBinding', options: {exact: false}, icon: { shape: 'administrator', solid: false } } },
      { a: { link: 'kubernetes/clusterrolebinding', text: 'ClusterRoleBinding', options: {exact: false}, icon: { shape: 'administrator', solid: true } } },
      { a: { link: 'kubernetes/serviceaccount', text: 'ServiceAccount', options: { exact: false }, icon: { shape: 'user', solid: false } } },
      { type: SideNavType.Divider },
      { a: { link: 'kubernetes/deployment', text: 'Deployment', options: { exact: false }, icon: { shape: 'event', solid: false } } },
      { a: { link: 'kubernetes/replicaset', text: 'ReplicaSet', options: { exact: false }, icon: { shape: 'box-plot', solid: false } } },
      { a: { link: 'kubernetes/statefulset', text: 'StatefulSet', options: { exact: false }, icon: { shape: 'blocks-group', solid: false } } },
      { a: { link: 'kubernetes/daemonset', text: 'DaemonSet', options: { exact: false }, icon: { shape: 'layers', solid: false } } },
      { a: { link: 'kubernetes/cronjob', text: 'CronJob', options: { exact: false }, icon: { shape: 'clock', solid: false } } },
      { a: { link: 'kubernetes/job', text: 'Job', options: { exact: false }, icon: { shape: 'clock', solid: true } } },
      { a: { link: 'kubernetes/pod', text: 'Pod', options: { exact: false }, icon: { shape: 'tree', solid: true } } },
      { a: { link: 'kubernetes/horizontalpodautoscaler', text: 'HPA.HPA', options: { exact: false }, icon: { shape: 'cloud-scale', solid: false } } },
      { type: SideNavType.Divider },
      { a: { link: 'kubernetes/service', text: 'Service', options: { exact: false }, icon: { shape: 'network-globe', solid: false } } },
      { a: { link: 'kubernetes/endpoint', text: 'Endpoint', options: { exact: false }, icon: { shape: 'tree-view', solid: false } } },
      { a: { link: 'kubernetes/ingress', text: 'Ingress', options: { exact: false }, icon: { shape: 'network-switch', solid: false } } },
      { type: SideNavType.Divider },
      { a: { link: 'kubernetes/configmap', text: 'ConfigMap', options: { exact: false }, icon: { shape: 'file-settings', solid: false } } },
      { a: { link: 'kubernetes/secret', text: 'Secret', options: { exact: false }, icon: { shape: 'certificate', solid: false } } },
      { a: { link: 'kubernetes/persistentvolume', text: 'PersistentVolume', options: { exact: false }, icon: { shape: 'storage', solid: false } } },
      { a: { link: 'kubernetes/persistentvolumeclaim', text: 'MENU.PVC', options: { exact: false }, icon: { shape: 'data-cluster', solid: false } } },
      { a: { link: 'kubernetes/storageclass', text: 'StorageClass', options: { exact: false }, icon: { shape: 'data-cluster', solid: true } } },
    ]
  },
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.SYSTEM_STATISTICS', shape: 'image-gallery' }, text: 'MENU.SYSTEM_STATISTICS', child: [
      { a: { link: 'reportform/app', text: 'MENU.PROJECT_REPORT', options: { exact: true } } },
      { a: { link: 'reportform/deploy', text: 'MENU.RELEASE_STATISTICS', options: { exact: true } } }
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.CONFIGURATION', shape: 'cog' }, text: 'MENU.CONFIGURATION', child: [
      { a: { link: 'config/system', text: 'MENU.SYSTEM_CONFIGURATION', options: { exact: true } } },
      { a: { link: 'config/database', text: 'MENU.DATABASE_CONFIGURATION', options: { exact: true } } }
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.PERMISSION', shape: 'users' }, text: 'MENU.PERMISSION', name: 'system', child: [
      { a: { link: 'system/user', text: 'MENU.USER_LIST', options: { exact: true } } },
      { a: { link: 'system/group', text: 'MENU.ROLE_LIST', options: { exact: true } } },
      { a: { link: 'system/permission', text: 'MENU.PERMISSION_LIST', options: { exact: true } } },
      { a: { link: 'apikey', text: 'MENU.API_KEYS', options: { exact: true } } },
    ]
  },
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.NAMESPACE', shape: 'vmw-app' }, text: 'MENU.NAMESPACE', child: [
      { a: { link: 'namespace', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'namespace/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.APP', shape: 'window-restore' }, text: 'MENU.APP', child: [
      { a: { link: 'app', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'app/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
    ]
  },
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.DEPLOYMENT', shape: 'event' }, text: 'MENU.DEPLOYMENT', child: [
      { a: { link: 'deployment', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'deployment/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'deployment/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'deployment/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.STATEFULSET', shape: 'blocks-group' }, text: 'MENU.STATEFULSET', child: [
      { a: { link: 'statefulset', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'statefulset/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'statefulset/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'statefulset/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.DAEMONSET', shape: 'layers' }, text: 'MENU.DAEMONSET', child: [
      { a: { link: 'daemonset', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'daemonset/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'daemonset/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'daemonset/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.CRONJOB', shape: 'clock' }, text: 'MENU.CRONJOB', child: [
      { a: { link: 'cronjob', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'cronjob/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'cronjob/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'cronjob/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.AUTO_POD_SCALE', shape: 'cloud-scale' }, text: 'MENU.AUTO_POD_SCALE', child: [
      { a: { link: 'hpa', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'hpa/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'hpa/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'hpa/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.SERVICE', shape: 'network-globe' }, text: 'MENU.SERVICE', child: [
      { a: { link: 'service', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'service/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'service/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'service/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.EDGE_NODE_ABOUT', shape: 'cloud-traffic' }, text: 'MENU.EDGE_NODE_ABOUT', name: 'edge-node', child: [
      { a: { link: 'service/edge-node', text: 'MENU.EDGE_NODE_CONFIG', options: { exact: true } } },
      { a: { link: 'service/available-port', text: 'MENU.AVAILABLE_PORT_CONFIG', options: { exact: true } } },
      { a: { link: 'service/used-port', text: 'MENU.USED_PORT', options: { exact: true } } },
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'Ingress', shape: 'network-switch' }, text: 'Ingress', child: [
      { a: { link: 'ingress', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'ingress/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'ingress/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'ingress/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.CONFIGMAP', shape: 'file-settings' }, text: 'MENU.CONFIGMAP', child: [
      { a: { link: 'configmap', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'configmap/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'configmap/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'configmap/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.SECRET', shape: 'certificate' }, text: 'MENU.SECRET', child: [
      { a: { link: 'secret', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'secret/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'secret/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'secret/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.PVC', shape: 'storage' }, text: 'MENU.PVC', child: [
      { a: { link: 'persistentvolumeclaim', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'persistentvolumeclaim/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'persistentvolumeclaim/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'persistentvolumeclaim/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
    ]
  },
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.NOTIFICATION_AUDIT', shape: 'bell', solid: true }, text: 'MENU.NOTIFICATION_AUDIT', child: [
      { a: { link: 'notification', text: 'MENU.NOTIFICATION', options: { exact: true }, icon: { shape: 'bell' } } },
      { a: { link: 'auditlog', text: 'MENU.AUDIT_LOD', options: { exact: true }, icon: { shape: 'file-group' } } },
    ]
  },
];
export { adminSideNav, SideNavType };
