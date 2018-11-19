package slice

import "github.com/Qihoo360/wayne/src/backend/util/snaker"

func StrSliceContains(ss []string, s string) bool {
	for _, v := range ss {
		if v == s {
			return true
		}
	}
	return false
}

func CamelToSnake(ss []string) []string {
	result := make([]string, 0)
	for _, s := range ss {
		result = append(result, snaker.CamelToSnake(s))
	}
	return result
}
