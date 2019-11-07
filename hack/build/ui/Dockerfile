FROM node:10.16

WORKDIR /workspace

COPY src/frontend/package.json  /workspace

COPY src/frontend/package-lock.json  /workspace

RUN npm install --registry=https://registry.npm.taobao.org

