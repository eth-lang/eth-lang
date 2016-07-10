ETH := ./bin/eth
WATCH := ./node_modules/.bin/watch
WEBPACK := ./node_modules/.bin/webpack
NODE := node

all:
	$(ETH)

testing/index.js: testing/index.eth
	$(ETH) -c $< \
		| sed 's/__eth__import("eth\/ast")/__eth__import("..\/ast")/' \
		| sed 's/__eth__import("eth\/core")/__eth__import("..\/core")/' \
		>$@

tests/%.js: tests/%.eth
	$(ETH) -c $< \
		| sed 's/__eth__import("eth\/ast")/__eth__import("..\/ast")/' \
		| sed 's/__eth__import("eth\/core")/__eth__import("..\/core")/' \
		>$@

%.js: %.eth
	$(ETH) -c $< \
		| sed 's/__eth__import("eth\/ast")/__eth__import(".\/ast")/' \
		| sed 's/__eth__import("eth\/core")/__eth__import(".\/core")/' \
		>$@

website/%.js: website/%.eth
	eth -c $< >$@

website/eth.js: eth.js syntax.js core/index.js
	$(WEBPACK) -p

build: syntax.js testing/index.js \
  tests/core.js \
  website/repl.js website/eth.js

test: build
	$(NODE) tests/core.js

test-watch:
	$(WATCH) "make test" tests

clean:
	rm -f tests/*.js

clean-all: clean
	rm -f syntax.js
	rm -f testing/index.js

compiler-repl:
	node -e 'eth = require("./eth");' -i

push-website:
	git subtree push --prefix website/ origin gh-pages

.PHONY: all build build-stdlib build-tests build-syntax test clean compiler-repl push-website
