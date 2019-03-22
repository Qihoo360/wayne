# requiring Docker 17.05 or higher on the daemon and client
# see https://docs.docker.com/develop/develop-images/multistage-build/
# BUILD COMMAND :
# docker --build-arg RELEASE_VERSION=v1.0.0 -t infra/wayne:v1.0.0 .

# build ui
FROM 360cloud/wayne-ui-builder:v1.0.1 as frontend

ARG RAVEN_DSN

COPY src/frontend /workspace

RUN sed -i  "s~__ravenDsn__~${RAVEN_DSN}~g" /workspace/src/environments/environment.prod.ts

RUN cd /workspace && \
       npm config set registry https://registry.npm.taobao.org && \
       npm install && \
       npm run build

# build server
FROM 360cloud/wayne-server-builder:v1.0.0 as backend

COPY src/vendor /go/src/github.com/Qihoo360/wayne/src/vendor

COPY src/backend /go/src/github.com/Qihoo360/wayne/src/backend

RUN rm -rf /go/src/github.com/Qihoo360/wayne/src/backend/static

COPY --from=frontend /workspace/dist/ /go/src/github.com/Qihoo360/wayne/src/backend/static/

COPY --from=frontend /workspace/dist/index.html /go/src/github.com/Qihoo360/wayne/src/backend/views/

RUN cd /go/src/github.com/Qihoo360/wayne/src/backend && bee generate docs && bee pack -o /_build

# build release image
FROM 360cloud/centos:7

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

COPY --from=backend /_build/backend.tar.gz /opt/wayne/

WORKDIR /opt/wayne/

RUN tar -xzvf backend.tar.gz

CMD ["./backend"]
