# Change Log

## [v1.6.1](https://github.com/Qihoo360/wayne/tree/v1.6.1) (2019-04-15)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.6.0...v1.6.1)

**Merged pull requests:**

- fix: deployment strategy changeto rollingupdate error [\#395](https://github.com/Qihoo360/wayne/pull/395) ([BennieMeng](https://github.com/BennieMeng))


## [v1.6.0](https://github.com/Qihoo360/wayne/tree/v1.6.0) (2019-03-26)

[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.5.0...v1.6.0)

**Implemented enhancements:**

- Admin Kubernetes resource management support all namespace selection [\#336](https://github.com/Qihoo360/wayne/issues/336)
- 项目中的资源对象 [\#316](https://github.com/Qihoo360/wayne/issues/316)
- Portal Template support toggle [\#309](https://github.com/Qihoo360/wayne/issues/309)
- Openapi add get\_pod\_list [\#378](https://github.com/Qihoo360/wayne/pull/378) ([wilhelmguo](https://github.com/wilhelmguo))
- Ingress template optimization [\#375](https://github.com/Qihoo360/wayne/pull/375) ([wilhelmguo](https://github.com/wilhelmguo))
- Pod list api default order by names [\#373](https://github.com/Qihoo360/wayne/pull/373) ([wilhelmguo](https://github.com/wilhelmguo))
- Add template default values [\#372](https://github.com/Qihoo360/wayne/pull/372) ([wilhelmguo](https://github.com/wilhelmguo))
- Cronjob optmization [\#371](https://github.com/Qihoo360/wayne/pull/371) ([wilhelmguo](https://github.com/wilhelmguo))
- Admin kubernetes cluster add cache [\#364](https://github.com/Qihoo360/wayne/pull/364) ([wilhelmguo](https://github.com/wilhelmguo))
- future: support eks image [\#363](https://github.com/Qihoo360/wayne/pull/363) ([iyacontrol](https://github.com/iyacontrol))
- Feature/permissio
n optimization [\#357](https://github.com/Qihoo360/wayne/pull/357) ([wilhelmguo](https://github.com/wilhelmguo))
- Template edit form support Toggle info [\#354](https://github.com/Qihoo360/wayne/pull/354) ([BennieMeng](https://github.com/BennieMeng))
- Update db migration workflow [\#348](https://github.com/Qihoo360/wayne/pull/348) ([wilhelmguo](https://github.com/wilhelmguo))
- Update namespace model add kubenamespace field [\#347](https://github.com/Qihoo360/wayne/pull/347) ([wilhelmguo](https://github.com/wilhelmguo))
- Kubernetes pod add nodeName filter [\#343](https://github.com/Qihoo360/wayne/pull/343) ([wilhelmguo](https://github.com/wilhelmguo))
- frontend: add search enter [\#341](https://github.com/Qihoo360/wayne/pull/341) ([BennieMeng](https://github.com/BennieMeng))
- Add kubernetes resource all namespaces selection [\#340](https://github.com/Qihoo360/wayne/pull/340) ([wilhelmguo](https://github.com/wilhelmguo))
- Kubernetes pod list add podIP filter [\#338](https://github.com/Qihoo360/wayne/pull/338) ([wilhelmguo](https://github.com/wilhelmguo))

**Fixed bugs:**

- 后台管理endpoint更新无效 [\#339](https://github.com/Qihoo360/wayne/issues/339)
- 部署中包含多个环境变量，删除一个再新增加一个环境变量，之前的环境变量名称会丢失 [\#335](https://github.com/Qihoo360/wayne/issues/335)
- Resource statistics are inaccurate [\#331](https://github.com/Qihoo360/wayne/issues/331)
- 创建pvc模板时，必填项的“访问模式”不选择，也可以提交 [\#208](https://github.com/Qihoo360/wayne/issues/208)
- Portal template remove template initialDelaySeconds required [\#382](https://github.com/Qihoo360/wayne/pull/382) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix template diff display error. [\#379](https://github.com/Qihoo360/wayne/pull/379) ([wilhelmguo](https://github.com/wilhelmguo))
- Navigation container name change with input & fix collapse overflow hidden logic & change select directioin login [\#370](https://github.com/Qihoo360/wayne/pull/370) ([BennieMeng](https://github.com/BennieMeng))
- Fix deployment and statefulset depoy panic [\#352](https://github.com/Qihoo360/wayne/pull/352) ([wilhelmguo](https://github.com/wilhelmguo))
- Update README-CN.md [\#350](https://github.com/Qihoo360/wayne/pull/350) ([dangzhiqiang](https://github.com/dangzhiqiang))
- Fix deployment envs lost [\#346](https://github.com/Qihoo360/wayne/pull/346) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix endpoints update error [\#345](https://github.com/Qihoo360/wayne/pull/345) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix inaccurate resource statistics [\#344](https://github.com/Qihoo360/wayne/pull/344) ([wilhelmguo](https://github.com/wilhelmguo))
- Feature/fix pvc create tpl save without access [\#334](https://github.com/Qihoo360/wayne/pull/334) ([BennieMeng](https://github.com/BennieMeng))


## [v1.5.0](https://github.com/Qihoo360/wayne/tree/v1.5.0) (2019-03-01)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.4.3...v1.5.0)

**Implemented enhancements:**

- Model support toggle full screen [\#311](https://github.com/Qihoo360/wayne/issues/311)
- Support command and args  [\#300](https://github.com/Qihoo360/wayne/issues/300)
- Tpl edit add imagepullpolicy [\#326](https://github.com/Qihoo360/wayne/pull/326) ([wilhelmguo](https://github.com/wilhelmguo))
- confirm height 100 screen [\#323](https://github.com/Qihoo360/wayne/pull/323) ([BennieMeng](https://github.com/BennieMeng))
- frontend: remove modal padding [\#320](https://github.com/Qihoo360/wayne/pull/320) ([BennieMeng](https://github.com/BennieMeng))
- create-edit component rebuild [\#319](https://github.com/Qihoo360/wayne/pull/319) ([BennieMeng](https://github.com/BennieMeng))
- Deploy status optimization [\#315](https://github.com/Qihoo360/wayne/pull/315) ([wilhelmguo](https://github.com/wilhelmguo))
- Container template support add command and args [\#308](https://github.com/Qihoo360/wayne/pull/308) ([wilhelmguo](https://github.com/wilhelmguo))
- admin sidenav url change location [\#305](https://github.com/Qihoo360/wayne/pull/305) ([BennieMeng](https://github.com/BennieMeng))
- Migration Ingress from exist kubernetes clusters [\#135](https://github.com/Qihoo360/wayne/issues/135)
- Secret template support set type [\#114](https://github.com/Qihoo360/wayne/issues/114)
- Add kubernetes daemonset resource [\#285](https://github.com/Qihoo360/wayne/pull/285) ([wilhelmguo](https://github.com/wilhelmguo))
- Add kubernetes statefulset resource [\#282](https://github.com/Qihoo360/wayne/pull/282) ([wilhelmguo](https://github.com/wilhelmguo))
- Kubernetes add ingress resource [\#279](https://github.com/Qihoo360/wayne/pull/279) ([wilhelmguo](https://github.com/wilhelmguo))
- 增加集群和命名空间级别自定义注解 [\#274](https://github.com/Qihoo360/wayne/pull/274) ([iyacontrol](https://github.com/iyacontrol))
- Add Kubernetes pod enter container action [\#298](https://github.com/Qihoo360/wayne/pull/298) ([wilhelmguo](https://github.com/wilhelmguo))
- Add annotations to namespace in backend page [\#295](https://github.com/Qihoo360/wayne/pull/295) ([chengyumeng](https://github.com/chengyumeng))
- Add kubernetes rbac resources [\#294](https://github.com/Qihoo360/wayne/pull/294) ([wilhelmguo](https://github.com/wilhelmguo))
- Add kubernetes hpa support [\#293](https://github.com/Qihoo360/wayne/pull/293) ([wilhelmguo](https://github.com/wilhelmguo))
- Add kubernetes pvc and storageclass support [\#291](https://github.com/Qihoo360/wayne/pull/291) ([wilhelmguo](https://github.com/wilhelmguo))
- Add kubernetes replicaset resource [\#289](https://github.com/Qihoo360/wayne/pull/289) ([wilhelmguo](https://github.com/wilhelmguo))
- Kubernetes cronjob and job support [\#287](https://github.com/Qihoo360/wayne/pull/287) ([wilhelmguo](https://github.com/wilhelmguo))

**Fixed bugs:**

- 通过后台迁移configmap和ingress，在前台页面进行编辑时无法分配机房 [\#313](https://github.com/Qihoo360/wayne/issues/313)
- 一级菜单栏会被白色样式覆盖 [\#303](https://github.com/Qihoo360/wayne/issues/303)
- wayne worker run into Infinite loop if rabbitmq is down [\#245](https://github.com/Qihoo360/wayne/issues/245)
- Fix worker lost connection will fall into an infinite loop [\#322](https://github.com/Qihoo360/wayne/pull/322) ([wilhelmguo](https://github.com/wilhelmguo))
- 创建配置集模板提示404错误 [\#281](https://github.com/Qihoo360/wayne/issues/281)
- Fix list pvs status error [\#306](https://github.com/Qihoo360/wayne/pull/306) ([wilhelmguo](https://github.com/wilhelmguo))
- fix when exchange from table to json can not add updated data [\#301](https://github.com/Qihoo360/wayne/pull/301) ([chengyumeng](https://github.com/chengyumeng))
- fix edit template metadata miss adjust [\#297](https://github.com/Qihoo360/wayne/pull/297) ([BennieMeng](https://github.com/BennieMeng))
- fix pagechange invalid [\#292](https://github.com/Qihoo360/wayne/pull/292) ([BennieMeng](https://github.com/BennieMeng))
- fix paginate page change [\#286](https://github.com/Qihoo360/wayne/pull/286) ([BennieMeng](https://github.com/BennieMeng))
- Fix create or clone configtpl url redirect error [\#283](https://github.com/Qihoo360/wayne/pull/283) ([wilhelmguo](https://github.com/wilhelmguo))


## [v1.4.3](https://github.com/Qihoo360/wayne/tree/v1.4.3) (2019-03-01)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.4.2...v1.4.3)

**Fixed bugs:**

- frontend: update zh-Hans [\#325](https://github.com/Qihoo360/wayne/pull/325) ([BennieMeng](https://github.com/BennieMeng))

## [v1.4.2](https://github.com/Qihoo360/wayne/tree/v1.4.2) (2019-02-25)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.4.1...v1.4.2)

**Fixed bugs:**

- Fix list pvs status error [\#306](https://github.com/Qihoo360/wayne/pull/306) ([wilhelmguo](https://github.com/wilhelmguo))

## [v1.4.1](https://github.com/Qihoo360/wayne/tree/v1.4.1) (2019-02-18)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.4.0...v1.4.1)

**Fixed bugs:**

- fix paginate page change [\#286](https://github.com/Qihoo360/wayne/pull/286) ([BennieMeng](https://github.com/BennieMeng))
- Fix create or clone configtpl url redirect error [\#283](https://github.com/Qihoo360/wayne/pull/283) ([wilhelmguo](https://github.com/wilhelmguo))

## [v1.4.0](https://github.com/Qihoo360/wayne/tree/v1.4.0) (2019-02-15)

[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.3.2...v1.4.0)

**Implemented enhancements:**

- Name selectable exist name list [\#252](https://github.com/Qihoo360/wayne/issues/252)
- support for updating environment variables is added to the open interface of the upgrade deployment. [\#238](https://github.com/Qihoo360/wayne/issues/238)
- Service type support LoadBalancer [\#276](https://github.com/Qihoo360/wayne/pull/276) ([wilhelmguo](https://github.com/wilhelmguo))
- Secret template support set type [\#275](https://github.com/Qihoo360/wayne/pull/275) ([wilhelmguo](https://github.com/wilhelmguo))
- Name selectable [\#271](https://github.com/Qihoo360/wayne/pull/271) ([wilhelmguo](https://github.com/wilhelmguo))
- Different resource states by label of different colors [\#270](https://github.com/Qihoo360/wayne/pull/270) ([chengyumeng](https://github.com/chengyumeng))
- Support HPA mangement [\#171](https://github.com/Qihoo360/wayne/issues/171)
- 支持Endpoint [\#146](https://github.com/Qihoo360/wayne/issues/146)
- Support Kubernetes Pod resource management [\#136](https://github.com/Qihoo360/wayne/issues/136)
- Migration Secret from exist kubernetes clusters [\#134](https://github.com/Qihoo360/wayne/issues/134)
- Migration ConfigMap from exist kubernetes clusters [\#133](https://github.com/Qihoo360/wayne/issues/133)
- Migration Service from exist kubernetes clusters [\#132](https://github.com/Qihoo360/wayne/issues/132)
- migration from exist kubernetes clusters [\#68](https://github.com/Qihoo360/wayne/issues/68)
- Add kubernetes secret resource [\#259](https://github.com/Qihoo360/wayne/pull/259) ([wilhelmguo](https://github.com/wilhelmguo))
- Feature/add kubernetes configmap [\#256](https://github.com/Qihoo360/wayne/pull/256) ([wilhelmguo](https://github.com/wilhelmguo))
- Add kubernetes service and endpoint resource [\#255](https://github.com/Qihoo360/wayne/pull/255) ([wilhelmguo](https://github.com/wilhelmguo))
- Feature/add kubernetes pod resource [\#254](https://github.com/Qihoo360/wayne/pull/254) ([wilhelmguo](https://github.com/wilhelmguo))
- Feature: Add HPA in admin page. [\#247](https://github.com/Qihoo360/wayne/pull/247) ([chengyumeng](https://github.com/chengyumeng))

**Fixed bugs:**

- Wayne Get Pod Info Open API can't be used [\#260](https://github.com/Qihoo360/wayne/issues/260)
- Fix pod list create time ref error [\#278](https://github.com/Qihoo360/wayne/pull/278) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix pod log container i18 error [\#272](https://github.com/Qihoo360/wayne/pull/272) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix portal configmap get status error [\#266](https://github.com/Qihoo360/wayne/pull/266) ([wilhelmguo](https://github.com/wilhelmguo))
- View Pod log error [\#263](https://github.com/Qihoo360/wayne/issues/263)
- When click “进入容器”, can not enter the pod. [\#240](https://github.com/Qihoo360/wayne/issues/240)
- 后台管理的ingress中，回收站里的模板也不能删除和恢复 [\#225](https://github.com/Qihoo360/wayne/issues/225)
- 后台管理中的负载均衡和ingress列表，点击“名称”和“项目”全部跳转404页面? [\#224](https://github.com/Qihoo360/wayne/issues/224)
- Fix log detail error [\#261](https://github.com/Qihoo360/wayne/pull/261) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix get pod info API bug that label should be a key not a map [\#258](https://github.com/Qihoo360/wayne/pull/258) ([chengyumeng](https://github.com/chengyumeng))
- frontend:fix error route in jump url [\#239](https://github.com/Qihoo360/wayne/pull/239) ([chengyumeng](https://github.com/chengyumeng))

## [v1.3.2](https://github.com/Qihoo360/wayne/tree/v1.3.2) (2019-02-12)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.3.1...v1.3.2)

**Fixed bugs:**
- Wayne Get Pod Info Open API error  [\#260](https://github.com/Qihoo360/wayne/pull/258) ([chengyumeng](https://github.com/chengyumeng))

## [v1.3.1](https://github.com/Qihoo360/wayne/tree/v1.3.1) (2019-01-11)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.3.0...v1.3.1)

**Fixed bugs:**

- Fix Node resource statistics: limit to request [\#219](https://github.com/Qihoo360/wayne/pull/219) ([wilhelmguo](https://github.com/wilhelmguo))

## [v1.3.0](https://github.com/Qihoo360/wayne/tree/v1.3.0) (2019-01-11)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.2.2...v1.3.0)

**Implemented enhancements:**

- ingress支持多个path转发 [\#145](https://github.com/Qihoo360/wayne/issues/145)
- Display cluster resource usage on node list [\#140](https://github.com/Qihoo360/wayne/issues/140)
- Support Kubernetes Namespace resource management [\#139](https://github.com/Qihoo360/wayne/issues/139)
- Have no history and status of triggered  webhook [\#125](https://github.com/Qihoo360/wayne/issues/125)
- StatefulSet   DaemonSet   CronJob  add resource Request Limit Percent.  [\#113](https://github.com/Qihoo360/wayne/issues/113)
- Feature: Support Basic HPA In Frontend [\#207](https://github.com/Qihoo360/wayne/pull/207) ([chengyumeng](https://github.com/chengyumeng))
- Client cache optimization [\#196](https://github.com/Qihoo360/wayne/pull/196) ([wilhelmguo](https://github.com/wilhelmguo))
- Display cluster resource usage on node list [\#194](https://github.com/Qihoo360/wayne/pull/194) ([BennieMeng](https://github.com/BennieMeng))
- Add Node resource statistics [\#192](https://github.com/Qihoo360/wayne/pull/192) ([wilhelmguo](https://github.com/wilhelmguo))
- backend statefulset daemonset i18n [\#191](https://github.com/Qihoo360/wayne/pull/191) ([BennieMeng](https://github.com/BennieMeng))
- Feature: Add resource watcher for node and deployment [\#186](https://github.com/Qihoo360/wayne/pull/186) ([chengyumeng](https://github.com/chengyumeng))
- Resource request limit add [\#182](https://github.com/Qihoo360/wayne/pull/182) ([BennieMeng](https://github.com/BennieMeng))
- Feature: add fetch service list and get service detail from k8s cluster api to backend [\#170](https://github.com/Qihoo360/wayne/pull/170) ([HZ89](https://github.com/HZ89))
- Feature: add fetch ingress list and ingress detail from k8s cluster api to backend [\#169](https://github.com/Qihoo360/wayne/pull/169) ([HZ89](https://github.com/HZ89))

**Fixed bugs:**

- 无法创建新的部署，报错信息为：Cannot read property 'setValue' of undefined [\#211](https://github.com/Qihoo360/wayne/issues/211)
- 前台删除 PVC 时，如果没有勾选 PVC 模板，就会跳转404页面，并把该项目下的所有 PVC 模板全部删除 [\#206](https://github.com/Qihoo360/wayne/issues/206)
- When click wayne ingress,there is some error. [\#200](https://github.com/Qihoo360/wayne/issues/200)
- 多个集群切换，namespace 没有同时切换 [\#197](https://github.com/Qihoo360/wayne/issues/197)
- There is a js error when secret contains  chinese character [\#193](https://github.com/Qihoo360/wayne/issues/193)
- Fix normal user create deployment error [\#215](https://github.com/Qihoo360/wayne/pull/215) ([BennieMeng](https://github.com/BennieMeng))
- Fix pvc delete redirect error [\#213](https://github.com/Qihoo360/wayne/pull/213) ([BennieMeng](https://github.com/BennieMeng))
- Fix kubernetes deployment switch cluster not reload namespaces [\#212](https://github.com/Qihoo360/wayne/pull/212) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix secret save error when contain chinese character [\#203](https://github.com/Qihoo360/wayne/pull/203) ([BennieMeng](https://github.com/BennieMeng))
- Fix ingress router lost [\#199](https://github.com/Qihoo360/wayne/pull/199) ([chengyumeng](https://github.com/chengyumeng))
- Fix admin node and persistentVolume paginate select input change invalid [\#183](https://github.com/Qihoo360/wayne/pull/183) ([BennieMeng](https://github.com/BennieMeng))
- Fix:Add k8s namespace page flipping function in the background [\#178](https://github.com/Qihoo360/wayne/pull/178) ([chengyumeng](https://github.com/chengyumeng))

## [v1.2.2](https://github.com/Qihoo360/wayne/tree/v1.2.2) (2018-12-25)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.2.1...v1.2.2)

**Implemented enhancements:**

- User need an OpenAPI to get pod info by pod ip [\#131](https://github.com/Qihoo360/wayne/issues/131)
- When administrator create namespace at backend,Wayne should also create a namespace on k8s. [\#56](https://github.com/Qihoo360/wayne/issues/56)
- Feature: Ingress configures multiple paths [\#177](https://github.com/Qihoo360/wayne/pull/177) ([chengyumeng](https://github.com/chengyumeng))

**Fixed bugs:**

- Fix node list selector error [\#181](https://github.com/Qihoo360/wayne/pull/181) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix node list selector [\#180](https://github.com/Qihoo360/wayne/pull/180) ([wilhelmguo](https://github.com/wilhelmguo))

## [v1.2.1](https://github.com/Qihoo360/wayne/tree/v1.2.1) (2018-12-21)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.2.0...v1.2.1)

**Fixed bugs:**

- Fix some resources diff error [\#175](https://github.com/Qihoo360/wayne/pull/175) ([BennieMeng](https://github.com/BennieMeng))

## [v1.2.0](https://github.com/Qihoo360/wayne/tree/v1.2.0) (2018-12-21)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.1.0...v1.2.0)

**Implemented enhancements:**

- Users can compare the differences between the two templates [\#137](https://github.com/Qihoo360/wayne/issues/137)
- Can't create ingress webhook [\#128](https://github.com/Qihoo360/wayne/issues/128)
- Searchable Selected Box module [\#118](https://github.com/Qihoo360/wayne/issues/118)
- Migration Deployment support select Namespace [\#115](https://github.com/Qihoo360/wayne/issues/115)
- Prompt the user background to assign Namespace machine room. [\#112](https://github.com/Qihoo360/wayne/issues/112)
- Migration deployment from exist kubernetes clusters [\#104](https://github.com/Qihoo360/wayne/issues/104)
- support kubernetes ingress deploy [\#61](https://github.com/Qihoo360/wayne/issues/61)
- Update release version before release [\#168](https://github.com/Qihoo360/wayne/pull/168) ([wilhelmguo](https://github.com/wilhelmguo))
- Unified processing of resources [\#160](https://github.com/Qihoo360/wayne/pull/160) ([wilhelmguo](https://github.com/wilhelmguo))
- Feature/webhook add [\#127](https://github.com/Qihoo360/wayne/pull/127) ([chengyumeng](https://github.com/chengyumeng))
- Feature/migration support all namespaces [\#123](https://github.com/Qihoo360/wayne/pull/123) ([wilhelmguo](https://github.com/wilhelmguo))

**Fixed bugs:**

- ingress从回收站彻底删除不了 [\#152](https://github.com/Qihoo360/wayne/issues/152)
- Datatable load list resource repetition [\#124](https://github.com/Qihoo360/wayne/issues/124)
- fix admin portal. i18n:{{'BUTTON.EDIT' |translate}\] [\#163](https://github.com/Qihoo360/wayne/pull/163) ([CyaLiven](https://github.com/CyaLiven))
- Fix non-admin users cannot see ingress resources [\#148](https://github.com/Qihoo360/wayne/pull/148) ([wilhelmguo](https://github.com/wilhelmguo))
- frontend: fix page init reload list-resource [\#138](https://github.com/Qihoo360/wayne/pull/138) ([BennieMeng](https://github.com/BennieMeng))

## [v1.1.0](https://github.com/Qihoo360/wayne/tree/v1.1.0) (2018-12-07)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.0.1...v1.1.0)

**Implemented enhancements:**

- add restart deployment API [\#108](https://github.com/Qihoo360/wayne/pull/108) ([chengyumeng](https://github.com/chengyumeng))
- Feature/add kubernetes deployment migration [\#102](https://github.com/Qihoo360/wayne/pull/102) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix go admin description [\#97](https://github.com/Qihoo360/wayne/pull/97) ([chinaboard](https://github.com/chinaboard))
- Feature/format frontend code [\#90](https://github.com/Qihoo360/wayne/pull/90) ([wilhelmguo](https://github.com/wilhelmguo))
- Feature/translate [\#72](https://github.com/Qihoo360/wayne/pull/72) ([BennieMeng](https://github.com/BennieMeng))
- Feature/rename oauth2 qihoo to oauth2 [\#67](https://github.com/Qihoo360/wayne/pull/67) ([wilhelmguo](https://github.com/wilhelmguo))
- Feature/default config optimization [\#59](https://github.com/Qihoo360/wayne/pull/59) ([wilhelmguo](https://github.com/wilhelmguo))
- Feature/kubernetes example dependency resource adjust [\#53](https://github.com/Qihoo360/wayne/pull/53) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix notification model orm warning [\#52](https://github.com/Qihoo360/wayne/pull/52) ([chengyumeng](https://github.com/chengyumeng))

**Fixed bugs:**

- Background does not set up cluster resources online display problem [\#94](https://github.com/Qihoo360/wayne/issues/94)
- 后台删除的项目，在回收站无法恢复 [\#93](https://github.com/Qihoo360/wayne/issues/93)
- 集群name不是全部大写，调用开放api报错 [\#66](https://github.com/Qihoo360/wayne/issues/66)
- PVC详情的扩展看板功能无效，js错误 Uncaught TypeError: Cannot read property 'nativeElement' of undefined [\#43](https://github.com/Qihoo360/wayne/issues/43)
- 计划任务提交后报错，并无法再点开高级配置 [\#38](https://github.com/Qihoo360/wayne/issues/38)
- Fix modal size change bug [\#60](https://github.com/Qihoo360/wayne/pull/60) ([BennieMeng](https://github.com/BennieMeng))
- Fix CronJob bug that opens advanced mode paste yaml error r… [\#58](https://github.com/Qihoo360/wayne/pull/58) ([wilhelmguo](https://github.com/wilhelmguo))

## [v1.0.1](https://github.com/Qihoo360/wayne/tree/v1.0.1) (2018-11-22)
[Full Changelog](https://github.com/Qihoo360/wayne/compare/v1.0.0...v1.0.1)

**Implemented enhancements:**

- English version of README? [\#18](https://github.com/Qihoo360/wayne/issues/18)
- 未校验用户邮箱格式 [\#11](https://github.com/Qihoo360/wayne/issues/11)
- 资源单位的显示 [\#7](https://github.com/Qihoo360/wayne/issues/7)
- kubernetes install optimization [\#51](https://github.com/Qihoo360/wayne/pull/51) ([wilhelmguo](https://github.com/wilhelmguo))
- Feature/update kubernetes install [\#47](https://github.com/Qihoo360/wayne/pull/47) ([wilhelmguo](https://github.com/wilhelmguo))
-  Fix the problem of creating a user verification in the background is not strict. [\#35](https://github.com/Qihoo360/wayne/pull/35) ([chengyumeng](https://github.com/chengyumeng))
- Feature/ace switch error notify [\#34](https://github.com/Qihoo360/wayne/pull/34) ([BennieMeng](https://github.com/BennieMeng))
- 添加创建部署资源单位,样式调整 [\#27](https://github.com/Qihoo360/wayne/pull/27) ([BennieMeng](https://github.com/BennieMeng))

**Fixed bugs:**

- 上线次数统计  日期选择后格式不正确 [\#20](https://github.com/Qihoo360/wayne/issues/20)
- 在前台界面，选择“部门概览”，再选择“上线记录”会报错 [\#19](https://github.com/Qihoo360/wayne/issues/19)
- switch start\_time or end\_time to query online statistics, api/v1/publish/statistics报错400 [\#13](https://github.com/Qihoo360/wayne/issues/13)
- resource api/v1/kubernetes/namespaces 报错500 [\#10](https://github.com/Qihoo360/wayne/issues/10)
- APIKeys 报错403 [\#9](https://github.com/Qihoo360/wayne/issues/9)
- 创建namespace，按钮无法点击 [\#4](https://github.com/Qihoo360/wayne/issues/4)
- Fix the problem that the first startup does not have namespace, causing the front desk to report an error. [\#44](https://github.com/Qihoo360/wayne/pull/44) ([chengyumeng](https://github.com/chengyumeng))
- Fix load apikeys error when not set APIKey [\#33](https://github.com/Qihoo360/wayne/pull/33) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix edit namespace error bug [\#28](https://github.com/Qihoo360/wayne/pull/28) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix admin reportform dateformat error [\#26](https://github.com/Qihoo360/wayne/pull/26) ([wilhelmguo](https://github.com/wilhelmguo))
- Fix init namespace error [\#6](https://github.com/Qihoo360/wayne/pull/6) ([wilhelmguo](https://github.com/wilhelmguo))

## [v1.0.0](https://github.com/Qihoo360/wayne/tree/v1.0.0) (2018-11-19)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*
