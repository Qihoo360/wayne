package cmd

import (
	"fmt"

	"github.com/Qihoo360/wayne/src/backend/cmd/apiserver"
	"github.com/Qihoo360/wayne/src/backend/cmd/worker"
	"github.com/spf13/cobra"
)

var Version string

var RootCmd = &cobra.Command{
	Use: "wayne",
}

var VersionCmd = &cobra.Command{
	Use:     "version",
	Aliases: []string{"v"},
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("wayne %s \n", Version)
	},
}

func init() {
	cobra.EnableCommandSorting = false

	RootCmd.AddCommand(apiserver.APIServerCmd)
	RootCmd.AddCommand(worker.WorkerCmd)

	RootCmd.AddCommand(VersionCmd)
}
