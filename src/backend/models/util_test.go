package models_test

import (
	"fmt"
	"testing"

	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/models"
	_ "github.com/go-sql-driver/mysql"
)

func TestGetAll(t *testing.T) {

	fmt.Println(models.GetTotal(models.TableNameDeployment, &common.QueryParam{
		Query: map[string]interface{}{
			"app__id": 3,
		},
	}))

}
