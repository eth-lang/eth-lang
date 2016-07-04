ETH := ../../bin/eth

FILES = server.js utils.js
TEST_FILES = test/utils.js

default: run

%.js: %.eth
	$(ETH) -c $< >$@

run: build
	node server.js

build: $(FILES) $(TEST_FILES)

test: build
	node ./test/utils.js

clean:
	@rm -rf *.js
	@rm -rf test/*.js
