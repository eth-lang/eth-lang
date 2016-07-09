ETH := ./node_modules/.bin/eth

FILES = utils.js server.js
TEST_FILES = test/utils.js

default: run

%.js: %.eth
	$(ETH) -c $< >$@

build: $(FILES) $(TEST_FILES)

run: build
	node server.js

test: build
	node ./test/utils.js

clean:
	@rm -rf *.js
	@rm -rf test/*.js
