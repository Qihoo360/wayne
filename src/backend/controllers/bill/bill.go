package bill

import (
	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
)

type InvoiceResponse struct {
	Total    float64          `json:"total"`
	Invoices []models.Invoice `json:"invoice"`
}

type ChargeResponse struct {
	Total   float64         `json:"total"`
	Charges []models.Charge `json:"charges"`
}

// 操作 账单 相关资源
type BillController struct {
	base.APIController
}

func (c *BillController) URLMapping() {
	c.Mapping("ListInvoice", c.ListInvoice)
	c.Mapping("ListCharge", c.ListCharge)
}

func (c *BillController) Prepare() {
	// Check administration
	c.APIController.Prepare()
	// Check permission
	perAction := ""
	_, method := c.GetControllerAndAction()
	switch method {
	case "ListInvoice", "ListCharge":
		perAction = models.PermissionRead
	}
	if perAction != "" {
		c.CheckPermission(models.PermissionBill, perAction)
	}
}

// @Title List Invoice/
// @Description 用于项目账单的获取，该接口优先用于 app 级别的账单获取
// @Param   app       query string false "resource app"
// @Param   namespace query string false "resource namespace"
// @router /:appid [get]
func (c *BillController) ListInvoice() {
	param := c.BuildQueryParam()
	if c.NamespaceId != 0 {
		ns, err := models.NamespaceModel.GetById(c.NamespaceId)
		if err != nil {
			c.HandleError(err)
			return
		}
		param.Query["namespace__contains"] = ns.Name
	}
	if c.AppId != 0 {
		app, err := models.AppModel.GetById(c.AppId)
		if err != nil {
			c.HandleError(err)
			return
		}
		param.Query["app__contains"] = app.Name
	}

	var invoices InvoiceResponse
	err := models.GetAll(new(models.Invoice), &invoices.Invoices, param)
	if err != nil {
		c.HandleError(err)
		return
	}
	for _, a := range invoices.Invoices {
		invoices.Total += a.Amount
	}
	c.Success(invoices)
}

// @Title List Charge/
// @Description 用于项目账单明细的获取
// @Param   app       query string false "resource app"
// @Param   namespace query string false "resource namespace"
// @router /:appid/:name [get]
func (c *BillController) ListCharge() {
	param := c.BuildQueryParam()
	if c.NamespaceId != 0 {
		ns, err := models.NamespaceModel.GetById(c.NamespaceId)
		if err != nil {
			c.HandleError(err)
			return
		}
		param.Query["namespace__contains"] = ns.Name
	}
	if c.AppId != 0 {
		app, err := models.AppModel.GetById(c.AppId)
		if err != nil {
			c.HandleError(err)
			return
		}
		param.Query["app__contains"] = app.Name
	}
	if name := c.Ctx.Input.Param(":name"); name != "" {
		param.Query["name__contains"] = name
	}

	var charges ChargeResponse
	err := models.GetAll(new(models.Charge), &charges.Charges, param)
	if err != nil {
		c.HandleError(err)
		return
	}
	for _, a := range charges.Charges {
		charges.Total += a.Amount
	}
	c.Success(charges)
}
