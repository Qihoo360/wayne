package initial

import (
	"io/ioutil"
	"path/filepath"

	"github.com/astaxie/beego"
	"github.com/dgrijalva/jwt-go"

	"github.com/Qihoo360/wayne/src/backend/apikey"
)

func InitRsaKey() {
	privateKey, err := jwt.ParseRSAPrivateKeyFromPEM(readKey("RsaPrivateKey"))
	if err != nil {
		panic(err)
	}
	apikey.RsaPrivateKey = privateKey

	publicKey, err := jwt.ParseRSAPublicKeyFromPEM(readKey("RsaPublicKey"))
	if err != nil {
		panic(err)
	}
	apikey.RsaPublicKey = publicKey

}

func readKey(key string) []byte {
	filename := beego.AppConfig.String(key)
	// get the abs
	// which will try to find the 'filename' from current workind dir too.
	pem, err := filepath.Abs(filename)
	if err != nil {
		panic(err)
	}

	// read the raw contents of the file
	data, err := ioutil.ReadFile(pem)
	if err != nil {
		panic(err)
	}

	return data
}
