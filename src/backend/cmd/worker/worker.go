package worker

import (
	"errors"
	"fmt"
	"os"
	"os/signal"
	"sync"
	"time"

	"github.com/astaxie/beego"
	"github.com/spf13/cobra"
	"github.com/streadway/amqp"

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
	go func(ch chan os.Signal, workerSet map[*workers.Worker]workers.Worker) {
		select {
		case <-ch:
			lock.Lock()
			for _, w := range workerSet {
				w.Stop()
			}
		}
	}(signalChan, workerSet)

	for {
		logs.Info("Start worker.......")
		var err error
		bus.DefaultBus, err = bus.NewBus(beego.AppConfig.String("BusRabbitMQURL"))
		if err != nil {
			logs.Critical("Connection bus error. Will retry connection after 5 second.", err)
			time.Sleep(5 * time.Second)
			continue
		}
		workerSet = make(map[*workers.Worker]workers.Worker)
		wg := &sync.WaitGroup{}
		for i := 0; i < concurrency; i++ {
			wg.Add(1)
			recoverableWorker(workerSet, workerType, wg)
			wg.Done()

		}
		wg.Wait()
		// Waits here for the channel to be closed，Let Handle know it's not time to reconnect
		logs.Warning("Receive closing error, will stop all working worker: ",
			<-bus.DefaultBus.Conn.NotifyClose(make(chan *amqp.Error)))
		for _, w := range workerSet {
			err := w.Stop()
			if err != nil {
				logs.Error("Stop worker (%v) error. %v", w, err)
			}
		}
	}

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
	go func() {
		// TODO run retry specified numbers, then exit
		err := worker.Run()
		if err != nil {
			logs.Critical("Run worker error.Will try rerun after 5 second.", err)
			wg.Add(1)
		}

	}()
	workerSet[&worker] = worker

}
