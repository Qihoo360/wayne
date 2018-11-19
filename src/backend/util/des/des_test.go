package des

import (
	"encoding/base64"
	"fmt"
	"testing"
)

func TestDes(t *testing.T) {
	origData := "longlongtexttest"
	key := []byte("Dhg4YuMn")
	result, err := DesEncrypt([]byte("longlongtexttest"), key)
	if err != nil {
		panic(err)
	}
	fmt.Println(base64.StdEncoding.EncodeToString(result))
	decryptPass, err := DesDecrypt(result, key)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(decryptPass))

	if origData != string(decryptPass) {
		t.Fatal("Encrypt not equals Decrypt")
	}
}
