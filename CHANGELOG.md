# Change Log

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