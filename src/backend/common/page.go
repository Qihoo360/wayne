package common

type Page struct {
	PageNo     int64       `json:"pageNo"`
	PageSize   int64       `json:"pageSize"`
	TotalPage  int64       `json:"totalPage"`
	TotalCount int64       `json:"totalCount"`
	List       interface{} `json:"list"`
}
