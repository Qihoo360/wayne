package controllers

import (
	"github.com/astaxie/beego"
)

// IndexController handles request to /
type IndexController struct {
	beego.Controller
}

// Get renders the index page
func (c *IndexController) Get() {
	c.TplExt = "html"
	c.TplName = "index.html"
	c.Render()
}
