FROM golang:1.10

RUN go get github.com/astaxie/beego \
        && go get github.com/beego/bee

RUN cd /go/src/github.com/beego/bee && \
    git remote add fork https://github.com/wilhelmguo/bee.git && \
    git pull fork master && \
    go install

WORKDIR /go/src/github.com/Qihoo360/wayne/src/backend
