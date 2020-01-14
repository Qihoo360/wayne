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

const SideNavCollapseStorage = 'nav-collapse';

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
      { a: { link: 'kubernetes/deployment', text: 'Deployment', options: { exact: false }, icon: { shape: 'event', solid: false } } },
      { a: { link: 'kubernetes/replicaset', text: 'ReplicaSet', options: { exact: false }, icon: { shape: 'box-plot', solid: false } } },
      { a: { link: 'kubernetes/pod', text: 'Pod', options: { exact: false }, icon: { shape: 'tree', solid: true } } },
      { a: { link: 'kubernetes/service', text: 'Service', options: { exact: false }, icon: { shape: 'network-globe', solid: false } } },
      { a: { link: 'kubernetes/configmap', text: 'ConfigMap', options: { exact: false }, icon: { shape: 'file-settings', solid: false } } },
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
      { a: { link: 'config/database', text: 'MENU.DATABASE_CONFIGURATION', options: { exact: true } } },
      { a: { link: 'config/roadmap', text: '链接类型列表', options: { exact: true } } },
      { a: { link: 'config/customlink', text: '自定义链接配置', options: { exact: true } } }
    ]
  },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.PERMISSION', shape: 'users' }, text: 'MENU.PERMISSION', name: 'system', child: [
      { a: { link: 'system/user', text: 'MENU.USER_LIST', options: { exact: true } } },
      { a: { link: 'system/group', text: 'MENU.ROLE_LIST', options: { exact: true } } },
      { a: { link: 'system/permission', text: 'MENU.PERMISSION_LIST', options: { exact: true } } },
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
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.SERVICE', shape: 'network-globe' }, text: 'MENU.SERVICE', child: [
      { a: { link: 'service', text: 'MENU.LIST', options: { exact: true } } },
      { a: { link: 'service/trash', text: 'MENU.RECYCLED', options: { exact: true } } },
      { a: { link: 'service/tpl', text: 'MENU.TEMPLATE_LIST', options: { exact: true } } },
      { a: { link: 'service/tpl/trash', text: 'MENU.TEMPLATE_RECYCLED', options: { exact: true } } },
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
  { type: SideNavType.Divider },
  {
    type: SideNavType.GroupLink, icon: { title: 'MENU.NOTIFICATION_AUDIT', shape: 'bell', solid: true }, text: 'MENU.NOTIFICATION_AUDIT', child: [
      { a: { link: 'notification', text: 'MENU.NOTIFICATION', options: { exact: true }, icon: { shape: 'bell' } } },
      { a: { link: 'auditlog', text: 'MENU.AUDIT_LOD', options: { exact: true }, icon: { shape: 'file-group' } } },
    ]
  },
];
export { adminSideNav, SideNavType, SideNavCollapseStorage };
