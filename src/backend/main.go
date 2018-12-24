package main

import (
	"github.com/Qihoo360/wayne/src/backend/cmd"
)

const Version = "v1.2.0"

func main() {
	cmd.Version = Version

	cmd.RootCmd.Execute()
}
