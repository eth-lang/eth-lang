all:
	./bin/eth

build-stdlib:
	./bin/eth -c core/index.eth >core/index.js
	./bin/eth -c core/index-test.eth >core/index-test.js
	./bin/eth -c testing/index.eth >testing/index.js

build: build-stdlib

test: build
	./test.sh
	node core/index-test.js

.PHONY: all build test
