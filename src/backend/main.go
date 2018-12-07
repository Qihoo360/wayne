package main

import (
	"github.com/Qihoo360/wayne/src/backend/cmd"
)

var Version string = "1.1.0"

func main() {
	cmd.Version = Version

	cmd.RootCmd.Execute()
}
