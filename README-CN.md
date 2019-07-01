# Wayne

[![Build Statue](https://travis-ci.org/Qihoo360/wayne.svg?branch=master)](https://travis-ci.org/Qihoo360/wayne)
[![Build Tag](https://img.shields.io/github/tag/Qihoo360/wayne.svg)](https://github.com/Qihoo360/wayne/releases)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/Qihoo360/wayne/blob/master/LICENSE)
[![Go Report Card](https://goreportcard.com/badge/github.com/Qihoo360/wayne)](https://goreportcard.com/report/github.com/Qihoo360/wayne)

[English](https://github.com/Qihoo360/wayne/blob/master/README.md) | [中文](https://github.com/Qihoo360/wayne/blob/master/README-CN.md)

Wayne 是一个通用的、基于 Web 的 **[Kubernetes](https://kubernetes.io)  多集群管理平台**。通过可视化 Kubernetes 对象模板编辑的方式，降低业务接入成本，
拥有完整的权限管理系统，适应多租户场景，是一款适合企业级集群使用的**发布平台**。

Wayne已大规模服务于360搜索，承载了内部绝大部分业务，稳定管理了近千个业务，上万个容器，运行了两年多时间，经受住了生产的考验。

> 命名起源：360 搜索私有云团队多数项目命名都来源于 DC 漫画的角色，Wayne 也不例外，[Wayne](https://en.wikipedia.org/wiki/Batman#Bruce_Wayne) 是声名显赫的超级英雄蝙蝠侠 Bruce Wayne 的名字。

![控制面板](https://360yun.org/wayne/images/dashboard-ui.png)

## 演示

[https://demo.360yun.org](https://demo.360yun.org)

## Features

- 基于 RBAC（Role based access control）的权限管理：用户通过角色与部门和项目关联，拥有部门角色允许操作部门资源，拥有项目角色允许操作项目资源，更加适合多租户场景。
- 简化 Kubernetes 对象创建：提供基础 Kubernetes 对象配置文件添加方式，同时支持高级模式直接编辑 Json/Yaml文件创建 Kubernetes 对象。
- LDAP/OAuth 2.0/DB 多种登录模式支持：集成企业级 LDAP 登录及 DB 登录模式，同时还可以实现 OAuth2 登录。
- 支持多集群、多租户：可以同时管理多个 Kubernetes 集群，并针对性添加特定配置，更方便的多集群、多租户管理。
- 提供完整审计模块：每次操作都会有完整的审计功能，追踪用于操作历史，同时支持用户自定义 webhook。
- 提供基于 APIKey 的开放接口调用：用户可自主申请相关 APIKey 并管理自己的部门和项目，运维人员也可以申请全局 APIKey 进行特定资源的全局管理。
- 保留完整的发布历史：用户可以便捷的找到任何一次历史发布，并可轻松进行回滚，以及基于特定历史版本更新 Kubernetes 资源。
- 具备完善的资源报表：用户可以轻松获取各项目的资源使用占比和历史上线频次（天级）以及其他基础数据的报表和图表。
- 提供基于严密权限校验的 Web shell：用户可以通过 Web shell 的形式进入发布的 Pod 进行操作，自带完整的权限校验。 
- 提供站内通知系统：方便管理员推送集群、业务通知和故障处理报告等。

## 架构设计

整体采用前后端分离的方案，其中前端采用 Angular 框架进行数据交互和展示，使用Ace编辑器进行 Kubernetes 资源模版编辑。后端采用 Beego 框架做数据接口处理，使用 Client-go 与 Kubernetes 进行交互，数据使用 MySQL 存储。

![架构图](https://360yun.org/wayne/images/architecture.png)

## 组件

- Web UI: 提供完整的业务开发和平台运维功能体验。
- Worker: 扩展一系列基于消息队列的功能，例如 Audit 和 Webhooks 等审计组件。

## 项目依赖

- Golang 1.12+([installation manual](https://golang.org/dl/))
- Docker 17.05+ ([installation manual](https://docs.docker.com/install))
- Bee  ([installation manual](https://github.com/wilhelmguo/bee)) (请务必使用链接版本，不要使用 beego 官方版本，存在一些定制)
- Node.js 8+ and npm 5+ ([installation with nvm](https://github.com/creationix/nvm#usage))
- MySQL 5.6+  (Wayne 主要数据都存在 MySQL 中)
- RabbitMQ (可选，如需扩展审计功能，例如操作审计和 Webhooks 等，则需部署)

## 快速启动

- 克隆代码仓库

```bash
$ go get github.com/Qihoo360/wayne
```

- 启动服务

  在 Wayne 的根目录下，通过 docker-compose 创建服务

```shell
$ docker-compose -f ./hack/docker-compose/docker-compose.yaml up
```

通过上述命令，您可以从通过 http://127.0.0.1:4200 访问本地 Wayne, 默认管理员账号 admin:admin。

> 注意：项目启动后还需要配置集群和Namespace等信息才可正常使用。详见 [集群配置](https://360yun.org/wayne/admin/cluster.html)


## 文档

- 请参照 [Wiki](https://360yun.org/wayne/)
