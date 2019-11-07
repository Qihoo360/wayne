package customlink

import (
	"strings"

	"github.com/Qihoo360/wayne/src/backend/controllers/base"
	"github.com/Qihoo360/wayne/src/backend/models"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type ShowLinkController struct {
	base.APIController
}

type Link struct {
	Displayname string
	Url         string
}

func (c *ShowLinkController) URLMapping() {
	c.Mapping("list", c.List)
}

// @Title GetCustomLink
// @Description Get all custom links belonging to this namespace
// @Param	namespaceId		query 	int	false		"namespace id"
// @Success 200 {object} allLinks success
// @router /links [get]
func (c *ShowLinkController) List() {
	// ns := c.Input().Get("namespace")
	namespaceId := c.NamespaceId
	ns, err := models.NamespaceModel.GetById(int64(namespaceId))
	if err != nil {
		logs.Error("get namespace by id (%d) error.%v", namespaceId, err)
		c.HandleError(err)
		return
	}
	nsName := ns.Name
	deleted := false
	defaultLinks, err := models.LinkTypeModel.GetAll(deleted)
	if err != nil {
		logs.Error("get default links error.%v", err)
		c.HandleError(err)
		return
	}
	defaults := make(map[string]*Link)
	nameMap := make(map[string]string)
	for _, linkType := range defaultLinks {
		dlink := &Link{
			Displayname: linkType.Displayname,
			Url:         linkType.DefaultUrl,
		}
		defaults[linkType.TypeName] = dlink
		nameMap[linkType.TypeName] = linkType.Displayname
	}

	// var customLinks []*models.CustomLink
	customLinks, err := models.CustomLinkModel.GetByNsName(nsName, deleted)
	if err != nil {
		logs.Error("get custom links error.%v", err)
		c.HandleError(err)
		return
	}
	for i, ck := range customLinks {
		customLinks[i].Displayname = nameMap[ck.LinkType]
	}
	customs := make(map[string]*Link)
	for _, clink := range customLinks {
		var curl string
		if bool(clink.Status) {
			if bool(clink.AddParam) {
				curl = processUrl(clink)
			} else {
				curl = clink.Url
			}
			link := &Link{
				Displayname: clink.Displayname,
				Url:         curl,
			}
			customs[clink.LinkType] = link
		}
	}
	var allLinks []*Link
	for name, link := range customs {
		defaults[name] = link
	}

	for _, link := range defaults {
		allLinks = append(allLinks, link)
	}

	c.Success(allLinks)
}

func processUrl(clink *models.CustomLink) (url string) {
	url = clink.Url
	urlList := strings.Split(clink.Params, ",")
	for _, param := range urlList {
		url += "&" + param + "=" + "{{" + param + "}}"
	}

	return url
}
