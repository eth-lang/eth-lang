WATCH := ./node_modules/.bin/watch
WEBPACK := ./node_modules/.bin/webpack
NODE := node

ifdef current
	ETH := ./bin/eth
else
	ETH := eth
endif

DEPS := -r ./old/ast -r ./old/core

all: build build-website

%.js: eth/%.eth
	$(ETH) -c $< >$@

build: \
	types.js core.js async.js testing.js helpers.js syntax.js \
	constants.js read.js expand.js optimize.js write.js beautify.js \
	eval.js eth.js cli.js
	$(ETH) -c test/types.eth >test/types.js
	$(ETH) -c test/core.eth >test/core.js
	$(ETH) -c test/read.eth >test/read.js
	$(ETH) -c test/helpers.eth >test/helpers.js

build-website:
	#$(WEBPACK) -p

test: build
	$(NODE) $(DEPS) test/types.js
	$(NODE) $(DEPS) test/core.js
	$(NODE) $(DEPS) test/helpers.js
	$(NODE) $(DEPS) test/read.js

test-watch:
	$(WATCH) "make test" test

clean:
	rm -f *.js
	rm -f test/*.js
	rm -f examples/node/utils.js
	rm -f examples/node/server.js
	rm -f examples/node/test/utils.js

repl:
	$(ETH)

repl-compiler:
	node -e 'eth = require("./eth");' -i

push-website:
	git subtree push --prefix website/ origin gh-pages

.PHONY: all build build-website test test-watch clean repl repl-compiler push-website
