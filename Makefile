all:
	./bin/eth

build:
	./bin/eth -c core/index.eth >core/index.js

test:
	./test.sh

.PHONY: all build test
