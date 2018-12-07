package dataselector

import (
	"sort"
	"strings"
	"time"

	"github.com/Qihoo360/wayne/src/backend/common"
	"github.com/Qihoo360/wayne/src/backend/models"
)

// GenericDataCell describes the interface of the data cell that contains all the necessary methods needed to perform
// complex data selection
// GenericDataSelect takes a list of these interfaces and performs selection operation.
// Therefore as long as the list is composed of GenericDataCells you can perform any data selection!
type DataCell interface {
	// GetPropertyAtIndex returns the property of this data cell.
	// Value returned has to have Compare method which is required by Sort functionality of DataSelect.
	GetProperty(PropertyName) ComparableValue
}

// ComparableValue hold any value that can be compared to its own kind.
type ComparableValue interface {
	// Compares self with other value. Returns 1 if other value is smaller, 0 if they are the same, -1 if other is larger.
	Compare(ComparableValue) int
	// Returns true if self value contains or is equal to other value, false otherwise.
	Contains(ComparableValue) bool
}

// SelectableData contains all the required data to perform data selection.
// It implements sort.Interface so its sortable under sort.Sort
// You can use its Select method to get selected GenericDataCell list.
type DataSelector struct {
	// GenericDataList hold generic data cells that are being selected.
	GenericDataList []DataCell
	// DataSelectQuery holds instructions for data select.
	DataSelectQuery *common.QueryParam
}

// Implementation of sort.Interface so that we can use built-in sort function (sort.Sort) for sorting SelectableData

// Len returns the length of data inside SelectableData.
func (self DataSelector) Len() int { return len(self.GenericDataList) }

// Swap swaps 2 indices inside SelectableData.
func (self DataSelector) Swap(i, j int) {
	self.GenericDataList[i], self.GenericDataList[j] = self.GenericDataList[j], self.GenericDataList[i]
}

// Less compares 2 indices inside SelectableData and returns true if first index is larger.
func (self DataSelector) Less(i, j int) bool {
	sort := self.DataSelectQuery.Sortby
	if sort != "" {
		asc := true
		if strings.Index(sort, "-") == 0 {
			asc = false
			sort = sort[1:]
		}
		a := self.GenericDataList[i].GetProperty(PropertyName(sort))
		b := self.GenericDataList[j].GetProperty(PropertyName(sort))
		// ignore sort completely if property name not found
		if a == nil || b == nil {
			return false
		}
		cmp := a.Compare(b)
		if cmp == 0 { // values are the same. Just return
			return false
		} else { // values different
			return (cmp == -1 && asc) || (cmp == 1 && !asc)
		}
	}
	return false
}

// Sort sorts the data inside as instructed by DataSelectQuery and returns itself to allow method chaining.
func (self *DataSelector) Sort() *DataSelector {
	sort.Sort(*self)
	return self
}

// Filter the data inside as instructed by DataSelectQuery and returns itself to allow method chaining.
func (self *DataSelector) Filter() *DataSelector {
	filteredList := []DataCell{}

	for _, c := range self.GenericDataList {
		matches := true
		for key, value := range self.DataSelectQuery.Query {
			// TODO now string default use contains condition, may be support labels and other types?
			if strings.Contains(key, models.ListFilterExprSep) {
				keySplit := strings.Split(key, models.ListFilterExprSep)
				key = keySplit[0]
			}
			v := c.GetProperty(PropertyName(key))
			if v == nil {
				matches = false
				continue
			}
			if !v.Contains(ParseToComparableValue(value)) {
				matches = false
				continue
			}
		}
		if matches {
			filteredList = append(filteredList, c)
		}
	}

	self.GenericDataList = filteredList
	return self
}

func ParseToComparableValue(value interface{}) ComparableValue {
	switch value.(type) {
	case string:
		return StdComparableString(value.(string))
	case int:
		return StdComparableInt(value.(int))
	case time.Time:
		return StdComparableTime(value.(time.Time))
	default:
		return nil
	}
}
