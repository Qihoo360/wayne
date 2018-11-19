package initial

import (
	"time"

	"github.com/Qihoo360/wayne/src/backend/client"
	"k8s.io/apimachinery/pkg/util/wait"
)

func InitClient() {
	// 定期更新client
	go wait.Forever(client.BuildApiserverClient, 5*time.Second)
}
