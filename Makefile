ETH := ./bin/eth
WATCH := ./node_modules/.bin/watch
NODE := node

all:
	$(ETH)

%.js: %.eth
	$(ETH) -c $< >$@

build-stdlib: core.js testing.js
	
build-tests: tests/core.js

build: build-stdlib build-tests

test: build
	./scripts/test.sh
	$(NODE) tests/core.js

test-watch:
	$(WATCH) "make test" tests

clean:
	rm -f tests/*.js

clean-all: clean
	rm -f testing.js
	rm -f core.js

compiler-repl:
	node -e 'eth = require("./eth-lang");' -i

.PHONY: all build build-stdlib build-tests test clean compiler-repl
