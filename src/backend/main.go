package main

import (
	"github.com/Qihoo360/wayne/src/backend/cmd"
)

const Version = "1.3.2"

func main() {
	cmd.Version = Version

	cmd.RootCmd.Execute()
}
