ETH := ./bin/eth
WATCH := ./node_modules/.bin/watch
NODE := node

all:
	$(ETH)

%.js: %.eth
	$(ETH) -c $< \
		| sed 's/require("eth\/ast")/require(".\/ast")/' \
		| sed 's/require("eth\/core")/require(".\/core")/' \
		>$@

testing/index.js: testing/index.eth
	$(ETH) -c $< \
		| sed 's/require("eth\/ast")/require("..\/ast")/' \
		| sed 's/require("eth\/core")/require("..\/core")/' \
		>$@

build: syntax.js testing/index.js

test: build
	# $(NODE) tests/core.js

test-watch:
	$(WATCH) "make test" tests

clean:
	rm -f tests/*.js

clean-all: clean
	rm -f syntax.js
	rm -f testing/index.js

compiler-repl:
	node -e 'eth = require("./eth-lang");' -i

.PHONY: all build build-stdlib build-tests build-syntax test clean compiler-repl
