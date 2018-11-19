package hack

import (
	"bytes"
	"testing"
)

func TestString(t *testing.T) {
	b := []byte("hello world")
	a := String(b)

	if a != "hello world" {
		t.Fatal(a)
	}

	b[0] = 'a'

	if a != "aello world" {
		t.Fatal(a)
	}

	b = append(b, "abc"...)

	t.Logf("a:%s,b:%s", a, b)
	// the result:a:aello world,b:aello worldabc
	// the reason is a is fixed length slice
	if a != "aello world" {
		t.Fatalf("a:%v, b:%v", a, b)
	}
}

func TestByte(t *testing.T) {
	a := "hello world"

	b := Slice(a)

	if !bytes.Equal(b, []byte("hello world")) {
		t.Fatal(string(b))
	}
}
