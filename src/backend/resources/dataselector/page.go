package dataselector

import (
	"github.com/Qihoo360/wayne/src/backend/common"
)

// GenericDataSelect takes a list of GenericDataCells and DataSelectQuery and returns selected data as instructed by dsQuery.
func DataSelectPage(dataList []DataCell, q *common.QueryParam) *common.Page {
	SelectableData := DataSelector{
		GenericDataList: dataList,
		DataSelectQuery: q,
	}
	// Pipeline is Filter -> Sort -> Paginate
	filtered := SelectableData.Filter().Sort()
	filteredTotal := len(filtered.GenericDataList)

	// slice start and end point
	start := q.Offset()
	end := start + q.Limit()
	if start > int64(filteredTotal) {
		start = int64(filteredTotal)
	}
	if end > int64(filteredTotal) {
		end = int64(filteredTotal)
	}

	pagedList := filtered.GenericDataList[start:end]

	return q.NewPage(int64(filteredTotal), pagedList)
}
