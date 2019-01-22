package worker

import (
	"errors"
	"fmt"
	"os"
	"os/signal"
	"sync"

	"github.com/astaxie/beego"
	"github.com/spf13/cobra"

	"github.com/Qihoo360/wayne/src/backend/bus"
	"github.com/Qihoo360/wayne/src/backend/initial"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
	"github.com/Qihoo360/wayne/src/backend/workers"
	"github.com/Qihoo360/wayne/src/backend/workers/audit"
	"github.com/Qihoo360/wayne/src/backend/workers/webhook"
)

var (
	WorkerCmd = &cobra.Command{
		Use:     "worker",
		PreRunE: preRunE,
		Run:     run,
	}

	workerType        string
	concurrency       int
	lock              sync.Mutex
	availableRecovery = 3
)

func init() {
	flags := WorkerCmd.Flags()

	flags.SortFlags = false
	flags.StringVarP(&workerType, "type", "t", "", "AuditWorker|WebhookWorker")
	flags.IntVarP(&concurrency, "concurrency", "c", 1, "")
}

func preRunE(cmd *cobra.Command, args []string) error {
	if workerType == "" {
		return errors.New("missing worker type")
	}

	switch workerType {
	case "AuditWorker", "WebhookWorker":
		break
	default:
		return errors.New(fmt.Sprintf("unknown worker type: %s", workerType))
	}

	return nil
}

func run(cmd *cobra.Command, args []string) {
	busEnable := beego.AppConfig.DefaultBool("BusEnable", false)
	if !busEnable {
		panic("Running workers requires BUS FEATURE enabled.")
	}

	initial.InitDb()
	initial.InitBus()

	workerSet := make(map[*workers.Worker]workers.Worker)
	signalChan := make(chan os.Signal)
	signal.Notify(signalChan, os.Interrupt)
	signal.Notify(signalChan, os.Kill)
	go func(ch chan os.Signal) {
		select {
		case <-ch:
			lock.Lock()
			for _, w := range workerSet {
				w.Stop()
			}
		}
	}(signalChan)

	wg := sync.WaitGroup{}
	for i := 0; i < concurrency; i++ {
		recoverableWorker(workerSet, workerType, &wg)
	}
	wg.Wait()
}

func recoverableWorker(workerSet map[*workers.Worker]workers.Worker, workerType string, wg *sync.WaitGroup) {
	lock.Lock()
	defer lock.Unlock()

	var worker workers.Worker
	var err error
	switch workerType {
	case "AuditWorker":
		worker, err = audit.NewAuditWorker(bus.DefaultBus)
	case "WebhookWorker":
		worker, err = webhook.NewWebhookWorker(bus.DefaultBus)
	default:
		err = fmt.Errorf("unknown worker type: %s", workerType)
	}
	if err != nil {
		logs.Critical(err)
		return
	}
	workerSet[&worker] = worker

	wg.Add(1)
	go func(w workers.Worker) {
		defer func() {
			if r := recover(); r != nil {
				logs.Critical(r)
				if availableRecovery > 0 {
					availableRecovery--
					recoverableWorker(workerSet, workerType, wg)
				} else {
					panic(r)
				}
			}
			w.Stop()
			delete(workerSet, &w)
			wg.Done()
		}()
		worker.Run()
	}(worker)
}
