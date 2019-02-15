#!/bin/sh

GO_MAIN=src/backend/main.go
PACKAGE_JSON=src/frontend/package.json
SWAGGER_VERSION_GO=src/backend/controllers/openapi/openapi.go

VERSION=(`grep -Eo "[0-9]+\.[0-9]+\.[0-9]+[a-z0-9\-]*" ${GO_MAIN}`)
NEXT_VERSION=$(git describe --always --tags)

echo "Project current version: [$VERSION], next_version:[$NEXT_VERSION] "

sed -i "s/$VERSION/$NEXT_VERSION/" ${GO_MAIN}
sed -i 's/\("version": "\)'$VERSION'/\1'$NEXT_VERSION'/' $PACKAGE_JSON
sed -i 's/\(Version: \)'$VERSION'/\1'$NEXT_VERSION'/' $SWAGGER_VERSION_GO
