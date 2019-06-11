# requiring Docker 17.05 or higher on the daemon and client
# see https://docs.docker.com/develop/develop-images/multistage-build/
# BUILD COMMAND :
# docker --build-arg RELEASE_VERSION=v1.0.0 -t infra/wayne:v1.0.0 .

# build server
FROM 360cloud/wayne-server-builder:v1.0.1 as backend

COPY go.mod /go/src/github.com/Qihoo360/wayne
COPY go.sum /go/src/github.com/Qihoo360/wayne

COPY src/backend /go/src/github.com/Qihoo360/wayne/src/backend

RUN export GO111MODULE=on && \
    export GOPROXY=https://goproxy.io && \
    cd /go/src/github.com/Qihoo360/wayne/src/backend && \
    bee generate docs && \
    bee pack -o /_build

# build release image
FROM 360cloud/centos:7

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

COPY --from=backend /_build/backend.tar.gz /opt/wayne/

WORKDIR /opt/wayne/

RUN tar -xzvf backend.tar.gz

CMD ["./backend"]
