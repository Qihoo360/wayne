package common

type QueryParam struct {
	PageNo   int64                  `json:"pageNo"`
	PageSize int64                  `json:"pageSize"`
	Query    map[string]interface{} `json:"query"`
	Sortby   string                 `json:"sortby"`
	Groupby  []string               `json:"groupby"`
	Relate   string                 `json:"relate"`
	// only for kubernetes resource
	LabelSelector string `json:"-"`
}

func (q *QueryParam) Offset() int64 {
	offset := (q.PageNo - 1) * q.PageSize
	if offset < 0 {
		offset = 0
	}
	return offset
}

func (q *QueryParam) Limit() int64 {
	return q.PageSize
}

func (q *QueryParam) NewPage(count int64, list interface{}) *Page {
	tp := count / q.PageSize
	if count%q.PageSize > 0 {
		tp = count/q.PageSize + 1
	}
	return &Page{
		PageNo:     q.PageNo,
		PageSize:   q.PageSize,
		TotalPage:  tp,
		TotalCount: count,
		List:       list,
	}
}
