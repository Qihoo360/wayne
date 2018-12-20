package main

import (
	"github.com/Qihoo360/wayne/src/backend/cmd"
)

const Version = "__version__"

func main() {
	cmd.Version = Version

	cmd.RootCmd.Execute()
}
