# Frontend

项目通过 [Angular CLI](https://github.com/angular/angular-cli) 6.1.5 创建。

portal 和 admin 分别代表前后台目录。

## Development server

> GO 开发者请直接查看 [wayne-dev-develop-flow](https://github.com/Qihoo360/wayne/wiki/Wayne-dev-develop-flow)

  **1. 克隆子项目** 
  ``` bash
  git submodule update --init --recursive 
  ```

  **2.使用 Docker 来启动 API 和数据库服务**

  请查看 [文档](../../README-CN.md)

  **3.安装依赖**
  ```
  npm install
  ```

  **4.启动开发环境**
   ```
  npm run start
  ```
  **5.访问 http://localhost:4200**

## Build

执行 `npm run build` 去打包项目，打包结果会保存在 `dist/` 目录下。
