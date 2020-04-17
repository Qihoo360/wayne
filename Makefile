.PHONY: run-backend run-worker run-frontend syncdb release

MAKEFLAGS += --warn-undefined-variables

# Build variables
REGISTRY_URI :=360cloud
RELEASE_VERSION :=$(shell git describe --always --tags)
UI_BUILD_VERSION :=v1.0.2
SERVER_BUILD_VERSION :=v1.0.2

update-version:
	./hack/updateversion.sh

# run module
run-backend:
	cd src/backend/ && go run main.go

run-frontend:
	cd src/frontend/ && npm start

# dev
syncdb:
	go run src/backend/database/syncdb.go orm syncdb

sqlall:
	go run src/backend/database/syncdb.go orm sqlall > _dev/wayne.sql

initdata:
	go run src/backend/database/generatedata/main.go > _dev/wayne-data.sql

swagger-openapi:
	cd src/backend && swagger generate spec -o ./swagger/openapi.swagger.json

## server builder image
build-server-image:
	docker build --no-cache -t $(REGISTRY_URI)/wayne-server-builder:$(SERVER_BUILD_VERSION) -f hack/build/server/Dockerfile .

## ui builder image
build-ui-image:
	docker build --no-cache -t $(REGISTRY_URI)/wayne-ui-builder:$(UI_BUILD_VERSION) -f hack/build/ui/Dockerfile .

# release, requiring Docker 17.05 or higher on the daemon and client
build-backend-image:
	@echo "version: $(RELEASE_VERSION)"
	docker build --no-cache -t $(REGISTRY_URI)/wayne-backend:$(RELEASE_VERSION) .

build-frontend-image:
	@echo "version: $(RELEASE_VERSION)"
	docker build --no-cache -t $(REGISTRY_URI)/wayne-frontend:$(RELEASE_VERSION) -f hack/build/frontend/Dockerfile .

push-image:
	docker tag $(REGISTRY_URI)/wayne-backend:$(RELEASE_VERSION) $(REGISTRY_URI)/wayne-backend:latest
	docker push $(REGISTRY_URI)/wayne-backend:$(RELEASE_VERSION)
	docker push $(REGISTRY_URI)/wayne-backend:latest
	docker tag $(REGISTRY_URI)/wayne-frontend:$(RELEASE_VERSION) $(REGISTRY_URI)/wayne-frontend:latest
	docker push $(REGISTRY_URI)/wayne-frontend:$(RELEASE_VERSION)
	docker push $(REGISTRY_URI)/wayne-frontend:latest

release: build-backend-image build-frontend-image push-image
