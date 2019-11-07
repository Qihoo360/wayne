FROM golang:1.12

RUN go get github.com/astaxie/beego \
        && go get github.com/beego/bee

RUN cd /go/src/github.com/beego/bee && \
    go install

WORKDIR /go/src/github.com/Qihoo360/wayne/src/backend
