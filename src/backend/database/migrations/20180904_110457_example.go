package main

import (
	"github.com/astaxie/beego/migration"
)

// DO NOT MODIFY
type Example_20180904_110457 struct {
	migration.Migration
}

// DO NOT MODIFY
func init() {
	m := &Example_20180904_110457{}
	m.Created = "20180904_110457"

	migration.Register("Example_20180904_110457", m)
}

// Run the migrations
func (m *Example_20180904_110457) Up() {
	// use m.SQL("CREATE TABLE ...") to make schema update

}

// Reverse the migrations
func (m *Example_20180904_110457) Down() {
	// use m.SQL("DROP TABLE ...") to reverse schema update

}
