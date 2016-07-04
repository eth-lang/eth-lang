ETH := ./bin/eth

all:
	$(ETH)

%.js: %.eth
	$(ETH) -c $< >$@

build-stdlib: core.js testing.js
	
build-tests: tests/core.js

build: build-stdlib build-tests

test: build
	./scripts/test.sh
	node tests/core.js

clean:
	rm -f tests/*.js

.PHONY: all build build-stdlib build-tests test clean
