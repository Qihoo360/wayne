.PHONY: run-backend run-worker run-frontend syncdb release

MAKEFLAGS += --warn-undefined-variables

# Runtime/Dev variables (used in src/backend/conf/app.conf)
-include .env
export

# Build variables
RELEASE_VERSION :=$(shell git describe --always --tags)
UI_BUILD_VERSION :=v1.0.0
SERVER_BUILD_VERSION :=v1.0.0


release: build-release-image push-image


# 运行相关
run-backend:
	cd src/backend/ && bee run -main=./main.go -runargs="apiserver"

run-worker:
	cd src/backend/ && bee run -main=./main.go -runargs="worker -t AuditWorker -c 2"

run-frontend:
	cd src/frontend/ && npm start


# 开发相关

syncdb:
	go run src/backend/database/syncdb.go orm syncdb

swagger-openapi:
	cd src/backend && swagger generate spec -o openapi.swagger.json
# 构建相关, 需要Docker版本17.05或者更高
build-release-image:
	@echo "version: $(RELEASE_VERSION)"
	docker build --no-cache --build-arg RAVEN_DSN=$(RAVEN_DSN) -t 360cloud/wayne:$(RELEASE_VERSION) .

push-image:
	docker push 360cloud/wayne:$(RELEASE_VERSION)


## 构建后端代码的编译环境
build-server-image:
	cd hack/build/server && docker build --no-cache \
	-t 360cloud/wayne-server-builder:$(SERVER_BUILD_VERSION) .

## 构建前端代码的编译环境
build-ui-image:
	docker build -f hack/build/ui/Dockerfile -t 360cloud/wayne-ui-builder:$(UI_BUILD_VERSION) .

