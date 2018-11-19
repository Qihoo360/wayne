FROM node:8.12

WORKDIR /workspace

COPY src/frontend/package.json  /workspace

COPY src/frontend/package-lock.json  /workspace

RUN npm config set registry https://registry.npm.taobao.org && \
       npm install

