package errors

import "fmt"

var _ error = &ErrorResult{}

// Error implements the Error interface.
func (e *ErrorResult) Error() string {
	return fmt.Sprintf("code:%d,subCode:%d,msg:%s", e.Code, e.SubCode, e.Msg)
}

type ErrorResult struct {
	// http code
	Code int `json:"code"`
	// The custom code
	SubCode int    `json:"subCode"`
	Msg     string `json:"msg"`
}
