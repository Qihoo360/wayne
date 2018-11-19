package models

type LdapConf struct {
	LdapURL               string `json:"ldap_url"`
	LdapSearchDn          string `json:"ldap_search_dn"`
	LdapSearchPassword    string `json:"ldap_search_password"`
	LdapBaseDn            string `json:"ldap_base_dn"`
	LdapFilter            string `json:"ldap_filter"`
	LdapUID               string `json:"ldap_uid"`
	LdapScope             int    `json:"ldap_scope"`
	LdapConnectionTimeout int    `json:"ldap_connection_timeout"`
}

// LdapUser ...
type LdapUser struct {
	Username string `json:"ldap_username"`
	Email    string `json:"ldap_email"`
	Realname string `json:"ldap_realname"`
	DN       string `json:"-"`
}
