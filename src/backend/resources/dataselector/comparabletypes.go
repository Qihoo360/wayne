package dataselector

import (
	"strings"
	"time"
)

type StdComparableInt int

func (self StdComparableInt) Compare(otherV ComparableValue) int {
	other := otherV.(StdComparableInt)
	return intsCompare(int(self), int(other))
}

func (self StdComparableInt) Contains(otherV ComparableValue) bool {
	return self.Compare(otherV) == 0
}

type StdComparableString string

func (self StdComparableString) Compare(otherV ComparableValue) int {
	other := otherV.(StdComparableString)
	return strings.Compare(string(self), string(other))
}

func (self StdComparableString) Contains(otherV ComparableValue) bool {
	other := otherV.(StdComparableString)
	return strings.Contains(string(self), string(other))
}

type StdComparableTime time.Time

func (self StdComparableTime) Compare(otherV ComparableValue) int {
	other := otherV.(StdComparableTime)
	return ints64Compare(time.Time(self).Unix(), time.Time(other).Unix())
}

func (self StdComparableTime) Contains(otherV ComparableValue) bool {
	return self.Compare(otherV) == 0
}

// Compares self with other value. Returns 1 if other value is smaller,
// 0 if they are the same, -1 if other is larger.
func ints64Compare(a, b int64) int {
	if a > b {
		return 1
	} else if a == b {
		return 0
	}
	return -1
}

// Int comparison functions. Similar to strings.Compare.
func intsCompare(a, b int) int {
	if a > b {
		return 1
	} else if a == b {
		return 0
	}
	return -1
}
