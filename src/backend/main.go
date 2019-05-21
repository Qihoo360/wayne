package main

import (
	"github.com/Qihoo360/wayne/src/backend/cmd"
)

const Version = "1.6.1"

func main() {
	cmd.Version = Version

	cmd.RootCmd.Execute()
}
