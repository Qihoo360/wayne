package ldap

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/astaxie/beego"

	"github.com/Qihoo360/wayne/src/backend/controllers/auth"
	"github.com/Qihoo360/wayne/src/backend/models"
	ldapUtils "github.com/Qihoo360/wayne/src/backend/util/ldap"
	"github.com/Qihoo360/wayne/src/backend/util/logs"
)

type LDAPAuth struct{}

const metaChars = "&|!=~*<>()"

func init() {
	auth.Register(models.AuthTypeLDAP, &LDAPAuth{})
}

func (*LDAPAuth) Authenticate(m models.AuthModel) (*models.User, error) {
	u := m.Username
	if len(strings.TrimSpace(u)) == 0 {
		logs.Info("LDAP authentication failed for empty user id.")
		return nil, nil
	}
	for _, c := range metaChars {
		if strings.ContainsRune(u, c) {
			return nil, fmt.Errorf("the principal contains meta char: %q", c)
		}
	}

	ldapConfs := models.LdapConf{}

	section, err := beego.AppConfig.GetSection("auth.ldap")
	if err != nil {
		return nil, fmt.Errorf("Can't find ldap config. ")
	}

	ldapConfs.LdapURL = section["ldap_url"]
	ldapConfs.LdapSearchDn = section["ldap_search_dn"]
	ldapConfs.LdapSearchPassword = section["ldap_search_password"]
	ldapConfs.LdapBaseDn = section["ldap_base_dn"]
	ldapConfs.LdapFilter = section["ldap_filter"]
	ldapConfs.LdapUID = section["ldap_uid"]
	ldapScope, err := strconv.ParseInt(section["ldap_scope"], 10, 64)
	if err != nil {
		return nil, fmt.Errorf("ldap_scope parse error, must be int. ")
	}
	ldapConnectionTimeout, err := strconv.ParseInt(section["ldap_connection_timeout"], 10, 64)
	if err != nil {
		return nil, fmt.Errorf("ldap_connection_timeout parse error, must be int. ")
	}
	ldapConfs.LdapScope = int(ldapScope)
	ldapConfs.LdapConnectionTimeout = int(ldapConnectionTimeout)
	ldapConfs, err = ldapUtils.ValidateLdapConf(ldapConfs)

	if err != nil {
		return nil, fmt.Errorf("invalid ldap request: %v", err)
	}

	ldapConfs.LdapFilter = ldapUtils.MakeFilter(u, ldapConfs.LdapFilter, ldapConfs.LdapUID)
	ldapUsers, err := ldapUtils.SearchUser(ldapConfs)

	if err != nil {
		logs.Warning("ldap search fail: %v", err)
		return nil, err
	}

	if len(ldapUsers) == 0 {
		logs.Warning("Not found an entry.")
		return nil, fmt.Errorf("Not found an entry. ")
	} else if len(ldapUsers) != 1 {
		logs.Warning("Found more than one entry.")
		return nil, fmt.Errorf("Found more than one entry. ")
	}

	user := &models.User{}
	user.Name = ldapUsers[0].Username
	user.Email = ldapUsers[0].Email
	user.Display = ldapUsers[0].Realname

	dn := ldapUsers[0].DN

	logs.Info("username: %s, dn: %s", user.Name, dn)
	if err := ldapUtils.Bind(ldapConfs, dn, m.Password); err != nil {
		logs.Warning("Failed to bind user, username: %s, dn: %s, error: %v", user.Name, dn, err)
		return nil, fmt.Errorf("Failed to bind user, username: %s, dn: %s, error: %v ", user.Name, dn, err)
	}

	return user, nil
}
