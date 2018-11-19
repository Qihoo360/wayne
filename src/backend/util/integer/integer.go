package integer

func Int2Int64(a int) int64 {
	return int64(a)
}

func Int2Int64Pointer(a int) *int64 {
	b := int64(a)
	return &b
}
