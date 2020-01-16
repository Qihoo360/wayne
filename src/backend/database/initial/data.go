package initial

// init wayne data
var InitialData = []string{
	// -- config
	`INSERT INTO  config  ( name,  value ) VALUES ('system.api-name-generate-rule', 'join');`,
	`INSERT INTO  config  ( name,  value ) VALUES ('system.oauth2-title', 'OAuth 2.0 Login');`,
	// -- user
	`INSERT INTO  user  ( id, name, email, display, comment, type, deleted, admin, last_login, last_ip, create_time, update_time, password, salt ) VALUES (1,'admin','admin@gmail.com','管理员','',0,0,1,now(),'127.0.0.1',now(),now(),'e7cadd50397b88397045bf1b7f406b34dc8dc6b8f79d470c0a80cf7aad08690748bf5e6c2d0881bb8bb9c96045b08318fa2b','BZoWKqwaQ6');`,
	// -- namespace
	`INSERT INTO  namespace  ( id, name, kube_namespace, meta_data, create_time, update_time, user, deleted ) VALUES (1,'demo','demo','{\"namespace\":\"default\"}',now(),now(),'admin',0);`,
	// -- permission
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('46', 'APPUSER_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('47', 'APPUSER_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('48', 'APPUSER_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('49', 'APPUSER_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('50', 'NAMESPACEUSER_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('51', 'NAMESPACEUSER_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('52', 'NAMESPACEUSER_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('53', 'NAMESPACEUSER_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('54', 'DEPLOYMENT_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('55', 'DEPLOYMENT_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('56', 'DEPLOYMENT_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('57', 'DEPLOYMENT_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('59', 'SERVICE_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('60', 'SERVICE_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('61', 'SERVICE_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('62', 'SERVICE_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('64', 'CONFIGMAP_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('65', 'CONFIGMAP_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('66', 'CONFIGMAP_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('67', 'CONFIGMAP_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('69', 'PVC_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('70', 'PVC_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('71', 'PVC_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('72', 'PVC_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('74', 'APP_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('75', 'APP_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('76', 'APP_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('77', 'APP_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('79', 'SECRET_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('80', 'SECRET_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('81', 'SECRET_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('82', 'SECRET_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('84', 'NAMESPACE_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('85', 'NAMESPACE_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('86', 'NAMESPACE_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('87', 'NAMESPACE_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('90', 'CRONJOB_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('91', 'CRONJOB_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('92', 'CRONJOB_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('93', 'CRONJOB_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('95', 'WEBHOOK_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('96', 'WEBHOOK_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('97', 'WEBHOOK_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('98', 'WEBHOOK_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('100', 'APIKEY_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('101', 'APIKEY_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('102', 'APIKEY_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('103', 'APIKEY_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('104', 'STATEFULSET_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('105', 'STATEFULSET_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('106', 'STATEFULSET_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('107', 'STATEFULSET_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('109', 'DAEMONSET_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('110', 'DAEMONSET_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('111', 'DAEMONSET_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('112', 'DAEMONSET_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('122', 'INGRESS_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('123', 'INGRESS_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('124', 'INGRESS_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('125', 'INGRESS_DELETE', '', now(), now());`,

	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('127', 'HPA_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('128', 'HPA_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('129', 'HPA_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('130', 'HPA_DELETE', '', now(), now());`,

	// Kubernetes resource permission
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('132', 'KUBECONFIGMAP_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('133', 'KUBECONFIGMAP_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('134', 'KUBECONFIGMAP_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('135', 'KUBECONFIGMAP_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('136', 'KUBEDAEMONSET_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('137', 'KUBEDAEMONSET_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('138', 'KUBEDAEMONSET_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('139', 'KUBEDAEMONSET_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('140', 'KUBEDEPLOYMENT_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('141', 'KUBEDEPLOYMENT_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('142', 'KUBEDEPLOYMENT_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('143', 'KUBEDEPLOYMENT_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('144', 'KUBEEVENT_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('145', 'KUBEEVENT_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('146', 'KUBEEVENT_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('147', 'KUBEEVENT_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('148', 'KUBEHORIZONTALPODAUTOSCALER_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('149', 'KUBEHORIZONTALPODAUTOSCALER_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('150', 'KUBEHORIZONTALPODAUTOSCALER_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('151', 'KUBEHORIZONTALPODAUTOSCALER_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('152', 'KUBEINGRESS_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('153', 'KUBEINGRESS_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('154', 'KUBEINGRESS_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('155', 'KUBEINGRESS_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('156', 'KUBEJOB_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('157', 'KUBEJOB_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('158', 'KUBEJOB_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('159', 'KUBEJOB_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('160', 'KUBECRONJOB_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('161', 'KUBECRONJOB_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('162', 'KUBECRONJOB_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('163', 'KUBECRONJOB_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('164', 'KUBENAMESPACE_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('165', 'KUBENAMESPACE_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('166', 'KUBENAMESPACE_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('167', 'KUBENAMESPACE_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('168', 'KUBENODE_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('169', 'KUBENODE_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('170', 'KUBENODE_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('171', 'KUBENODE_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('172', 'KUBEPERSISTENTVOLUMECLAIM_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('173', 'KUBEPERSISTENTVOLUMECLAIM_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('174', 'KUBEPERSISTENTVOLUMECLAIM_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('175', 'KUBEPERSISTENTVOLUMECLAIM_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('176', 'KUBEPERSISTENTVOLUME_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('177', 'KUBEPERSISTENTVOLUME_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('178', 'KUBEPERSISTENTVOLUME_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('179', 'KUBEPERSISTENTVOLUME_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('180', 'KUBEPOD_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('181', 'KUBEPOD_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('182', 'KUBEPOD_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('183', 'KUBEPOD_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('184', 'KUBEREPLICASET_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('185', 'KUBEREPLICASET_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('186', 'KUBEREPLICASET_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('187', 'KUBEREPLICASET_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('188', 'KUBESECRET_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('189', 'KUBESECRET_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('190', 'KUBESECRET_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('191', 'KUBESECRET_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('192', 'KUBESERVICE_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('193', 'KUBESERVICE_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('194', 'KUBESERVICE_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('195', 'KUBESERVICE_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('196', 'KUBESTATEFULSET_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('197', 'KUBESTATEFULSET_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('198', 'KUBESTATEFULSET_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('199', 'KUBESTATEFULSET_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('200', 'KUBEENDPOINTS_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('201', 'KUBEENDPOINTS_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('202', 'KUBEENDPOINTS_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('203', 'KUBEENDPOINTS_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('204', 'KUBESTORAGECLASS_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('205', 'KUBESTORAGECLASS_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('206', 'KUBESTORAGECLASS_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('207', 'KUBESTORAGECLASS_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('208', 'KUBEROLE_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('209', 'KUBEROLE_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('210', 'KUBEROLE_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('211', 'KUBEROLE_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('212', 'KUBEROLEBINDING_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('213', 'KUBEROLEBINDING_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('214', 'KUBEROLEBINDING_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('215', 'KUBEROLEBINDING_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('216', 'KUBECLUSTERROLE_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('217', 'KUBECLUSTERROLE_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('218', 'KUBECLUSTERROLE_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('219', 'KUBECLUSTERROLE_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('220', 'KUBECLUSTERROLEBINDING_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('221', 'KUBECLUSTERROLEBINDING_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('222', 'KUBECLUSTERROLEBINDING_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('223', 'KUBECLUSTERROLEBINDING_DELETE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('224', 'KUBESERVICEACCOUNT_CREATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('225', 'KUBESERVICEACCOUNT_UPDATE', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('226', 'KUBESERVICEACCOUNT_READ', '', now(), now());`,
	`INSERT INTO  permission  ( id,  name,  comment,  create_time,  update_time ) VALUES ('227', 'KUBESERVICEACCOUNT_DELETE', '', now(), now());`,

	// -- group
	// group 名称前加点可以解决group与mysql内置对象重名的问题
	`INSERT INTO  .group  ( id,  name,  comment,  type,  create_time,  update_time ) VALUES ('1', '访客', '访客', '1', now(), now());`,
	`INSERT INTO  .group  ( id,  name,  comment,  type,  create_time,  update_time ) VALUES ('8', '组管理员', '组管理员', '1', now(), now());`,
	`INSERT INTO  .group  ( id,  name,  comment,  type,  create_time,  update_time ) VALUES ('9', '组成员', '组成员', '1', now(), now());`,
	`INSERT INTO  .group  ( id,  name,  comment,  type,  create_time,  update_time ) VALUES ('10', '项目负责人', '项目负责人', '0', now(), now());`,
	`INSERT INTO  .group  ( id,  name,  comment,  type,  create_time,  update_time ) VALUES ('11', '项目开发', '项目开发', '0', now(), now());`,
	`INSERT INTO  .group  ( id,  name,  comment,  type,  create_time,  update_time ) VALUES ('12', '项目测试', '项目测试', '0', now(), now());`,
	`INSERT INTO  .group  ( id,  name,  comment,  type,  create_time,  update_time ) VALUES ('21', 'API_VIEWER', 'API只读权限', '2', now(), now());`,
	`INSERT INTO  .group  ( id,  name,  comment,  type,  create_time,  update_time ) VALUES ('22', 'API_EDITOR', 'API读写权限', '2', now(), now());`,

	// 项目负责人 -- group_permissions
	// APPUSER
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '46');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '47');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '48');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '49');`,
	// DEPLOYMENT
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '54');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '55');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '56');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '57');`,
	// SERVICE
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '59');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '60');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '61');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '62');`,
	// CONFIGMAP
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '64');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '65');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '66');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '67');`,
	// PVC
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '69');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '70');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '71');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '72');`,
	// SECRET
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '79');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '80');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '81');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '82');`,
	// CRONJOB
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '90');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '91');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '92');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '93');`,
	// WEBHOOK
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '95');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '96');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '97');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '98');`,
	// APIKEY
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '100');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '101');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '102');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '103');`,
	// STATEFULSET
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '104');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '105');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '106');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '107');`,
	// INGRESS
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '122');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '123');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '124');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '125');`,
	// HPA
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '127');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '128');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '129');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '130');`,

	// Kubernetes resource
	// Deployment
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '140');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '142');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '143');`,
	// StatefulSet
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '196');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '198');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '199');`,
	// CronJob
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '160');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '162');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '163');`,
	// Job
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '158');`,
	// HPA
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '148');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '150');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '151');`,
	// Service
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '192');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '194');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '195');`,
	// Ingress
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '152');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '154');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '155');`,
	// ConfigMap
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '133');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '134');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '135');`,
	// Secret
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '188');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '190');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '191');`,
	// PVC
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '172');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '174');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '175');`,
	// POD
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '182');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('10', '183');`,

	// 项目开发 -- group_permissions
	// APPUSER
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '48');`,

	// DEPLOYMENT
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '54');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '55');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '56');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '57');`,
	// SERVICE
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '59');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '60');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '61');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '62');`,
	// CONFIGMAP
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '64');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '65');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '66');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '67');`,
	// PVC
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '69');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '70');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '71');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '72');`,
	// SECRET
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '79');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '80');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '81');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '82');`,
	// CRONJOB
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '90');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '91');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '92');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '93');`,
	// WEBHOOK
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '97');`,
	// APIKEY
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '100');`,
	// STATEFULSET
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '104');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '105');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '106');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '107');`,
	// INGRESS
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '122');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '123');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '124');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '125');`,
	// HPA
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '127');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '128');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '129');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '130');`,

	// Kubernetes resource
	// Deployment
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '140');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '142');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '143');`,
	// StatefulSet
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '196');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '198');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '199');`,
	// CronJob
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '160');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '162');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '163');`,
	// Job
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '158');`,
	// HPA
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '148');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '150');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '151');`,
	// Service
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '192');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '194');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '195');`,
	// Ingress
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '152');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '154');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '155');`,
	// ConfigMap
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '133');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '134');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '135');`,
	// Secret
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '188');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '190');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '191');`,
	// PVC
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '172');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '174');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '175');`,
	// POD
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '182');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('11', '183');`,

	// 项目测试 -- group_permissions
	// APPUSER
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '48');`,

	// DEPLOYMENT
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '56');`,
	// SERVICE
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '61');`,
	// CONFIGMAP
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '66');`,
	// PVC
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '71');`,
	// SECRET
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '81');`,
	// CRONJOB
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '92');`,
	// WEBHOOK
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '97');`,
	// APIKEY
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '100');`,
	// STATEFULSET
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '104');`,
	// INGRESS
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '124');`,
	// HPA
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '129');`,

	// Kubernetes resource
	// Deployment
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '142');`,
	// StatefulSet
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '198');`,
	// CronJob
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '162');`,
	// Job
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '158');`,
	// HPA
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '150');`,
	// Service
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '194');`,
	// Ingress
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '154');`,
	// ConfigMap
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '134');`,
	// Secret
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '190');`,
	// PVC
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '174');`,
	// POD
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('12', '182');`,

	// 访客 -- group_permissions
	// APP
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '76');`,
	// DEPLOYMENT
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '56');`,
	// SERVICE
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '61');`,
	// CONFIGMAP
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '66');`,
	// PVC
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '71');`,
	// SECRET
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '81');`,
	// NAMESPACE
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '86');`,
	// CRONJOB
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '92');`,
	// STATEFULSET
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '104');`,
	// INGRESS
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '124');`,
	// HPA
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '129');`,

	// Kubernetes resource
	// Deployment
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '142');`,
	// StatefulSet
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '198');`,
	// CronJob
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '162');`,
	// Job
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '158');`,
	// HPA
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '150');`,
	// Service
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '194');`,
	// Ingress
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '154');`,
	// ConfigMap
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '134');`,
	// Secret
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '190');`,
	// PVC
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '174');`,
	// POD
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('1', '182');`,

	// 组管理员
	// APPUSER
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '46');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '47');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '48');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '49');`,
	// NAMESPACEUSER
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '50');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '51');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '52');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '53');`,
	// APP
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '74');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '75');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '76');`,
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '77');`,
	// NAMESPACE
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '86');`,
	// WEBHOOK
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '97');`,
	// APIKEY
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '100');`,
	// 组成员
	// APPUSER
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('9', '48');`,
	// APP
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('9', '76');`,
	// NAMESPACE
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('9', '86');`,
	// WEBHOOK
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('9', '97');`,
	// APIKEY
	`INSERT INTO  group_permissions  ( group_id,  permission_id ) VALUES ('8', '100');`,
}
