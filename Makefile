build:
	go build -o fnk cmd/fnk/main.go

test: build
	./test.sh
