package models

type NamespaceMigration struct {
	SourceId int64 `json:"sourceId"`
	TargetId int64 `json:"targetId"`
}
