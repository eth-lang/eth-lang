ETH := ./bin/eth
WATCH := ./node_modules/.bin/watch
WEBPACK := ./node_modules/.bin/webpack
NODE := node

all:
	$(ETH)

#		| sed 's/__eth__import("eth\/ast")/__eth__import("..\/ast")/' \
#		| sed 's/__eth__import("eth\/core")/__eth__import("..\/core")/' \

testing/index.js: testing/index.eth
	$(ETH) -c $< \
		>$@

test/%.js: test/%.eth
	$(ETH) -c $< \
		>$@

%.js: %.eth
	$(ETH) -c $< \
		>$@

website/%.js: website/%.eth
	eth -c $< >$@

website/eth.js: eth.js syntax.js core/index.js
	$(WEBPACK) -p

build: compiler/helpers.js \
  syntax.js testing/index.js \
  test/reader.js test/core.js \
  website/repl.js website/eth.js

test: build
	$(NODE) -r ./ast -r ./core test/reader.js
	$(NODE) -r ./ast -r ./core test/core.js

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
