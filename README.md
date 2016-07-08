<p align="center" style="text-align: center;">
  <img src="https://raw.githubusercontent.com/eth-lang/eth-lang/master/scripts/logo.png" alt="eth lang logo" />
  <h1>eth lang</h1>
  <i>A fun, experimental and simple lisp that compiles to JavaScript.</i>
</p>

[![CircleCI Build Status](https://img.shields.io/circleci/project/kiasaki/eth-lang/master.svg)](https://circleci.com/gh/kiasaki/eth-lang)

## intro

_WARNING! This is highly experimental tech, use at your own risk and perils ;)_

`eth` is a simple lisp that aims to give you the full power of the JavaScript language
and ecosystem but within the lisp syntax you've come to love. Most things you can write
in javascript directly translate to `eth`.

The Lisp syntax being more expressive than JavaScript aided by a few more concepts like
everything being an expression, **currying** and **function composition** it becomes easy to get
all of the goodies ES6 packs and more.

As `eth` is a lisp, it has this property called [homoiconicity](https://en.wikipedia.org/wiki/Homoiconicity)
that basically means it's syntax is closely related to it's program's structure. This makes
it possible to implement **macros** that provides you a way of extending the language you
program with in ways that you never could with JavaScript.

Here's what a package would look like:

```clj
(package hello-world (server-create server-listen)
  (import eth/core (..))
  (import http)
  (import util u)

  (set PORT 1337)

  (def server-create (message ... extra-messages)
    (http.create-server (fn (req res)
      (res.write-head 200 {"Content-Type" "text/plain"})
      (res.end (apply u.format (cons message extra-message))))))

  (def server-listen! (server port)
    (let (started (fn () (console.log (u.format "Started listenning on port " port))))
      ((. :listen server) port started)))

  (set server (server-create "Hello homoiconicity, expresiveness and fun times" "!" "!"))

  ; And here we go!
  (server-listen! server PORT))
```

_(Not really nice way of writing it but it demos language features XD See
[`examples/hello-compact.eth`](https://github.com/eth-lang/eth-lang/blob/master/examples/hello-compact.eth)
for a more node.js style version of the above)_

## running

You'll want to start by installing `eth` using `npm`:

```
npm install --global eth
```

There a repl you can start with:

```
$ eth
eth> (+ 3 5)
8
eth>
```

You can compile files to JavaScript using:

```
$ eth -c file.eth
// ... eth prelude ...
3 + 5;
```

Or run them right away using (for production use it's better to compile & run with `node`):

```
$ eth file.eth
8
```

In summary:

```
Eth Usage:
  eth                            run repl
  eth file.eth                   compile and run file
  eth [-h|--help]                show this message
  eth [-c|--compile] file.eth    compile file to JS
  eth [-a|--ast] file.eth        show file AST/tokens
```

## language syntax

| data type | eth | js | description |
|---|---|---|---|
| **comment** | `; comment` | ` ` | Eth only has single line comments and the don't appear in compiled code |
| **null** | `null` | `null` | Null is simply written "null" (`()` also evaluates to `null`) |
| **undefined** | `undefined` | `undefined` | Undefined is simply written "undefined" |
| **boolean** | `true` | `true` | Booleans are the same as in JavaScript |
| **string** | `"asd"` | `'asd'` | Strings are always double quoted and support multiline/new lines |
| **number** | `-1.23` | `-1.23` | Numbers are the same as in JavaScript |
| **symbol** | `name` | `name` | Symbols represent variables, they will mostly be have like in JavaScript but see "Special Syntax" for the few special ways you can use them |
| **keyword** | `:app-state?` | `'isAppState'` | Keywords are just a nice way of defining constants or object keys. In reality they are just JS strings. But, they get all the same "special syntax" rules of symbols applied to them |
| **list** | `(a b c)` | `a(b, c)` | Lists denote function application when evaluated |
| **array** | `[1 2 3]` | `[1, 2, 3]` | Arrays are the same as in JavaScript except that the commas are omitted |
| **object** | `{a 1 b 2}` | `{a: 1, b: 2}` | Object are the same as in JavaScript except that the commas (`,`) and colons (`:`) are omitted |

## special syntax

| eth | js | description |
|---|---|---|
| `a.b` | `a.b` | Having dots in a symbol will translate to the equivalent in JavaScript, no need to use `(. :b a)` all over the place |
| `@` | `this` | The `@` symbol simply translates `this` |
| `@prop` | `this.prop` | The `@` symbol followed by letter translate to getting a property of `this` |
| `some-fn` | `someFn` | `-` is not a valid in JavaScript but often used in lisp so symbols containing them are camel cased instead |
| `danger!` | `danger$` | `!` is not a valid in JavaScript symbols but often used in lisp |
| `healed?` | `isHealed` | `?` is not a valid in JavaScript symbols but often used in lisp |
| `(SomeClass. ...)` | `new SomeClass(...)` | The symbol ending in dot will be translated to the instantiation of the given class |

So, characters accepted in a **symbol** are all the valid characters from JavaScript (`0-9a-zA-Z_$`) with the additions we just saw: `-` anywhere, `!` at the end or `?` at the end.

## language built-ins

### binary operators

Most of JavaScript's binary operators are implemented and translated directly to the JavaScript
equivalent, hence (like most built-ins that follow) they can't be passed around as functions).

`(< 5 8)` translates directly to `5 < 8`.

The following are implemented:

```js
+ - * / % < > <= >= || && == != in instanceof
```

The following **unary** operators also work:

```js
! void typeof delete
```

### `fn`

`fn` is the built-in for creating functions. It translates to JavaScript's `function() {}`
syntax.

You can pass as much expressions you want after the arguments list and they will and be evaluated
sequentially with the last element being returned, a bit like the `do` built-in does.

`fn` supports the `...` variable arguments operator as before last argument to signify you
want the following argument name to be assigned to all extra arguments supplied to the function.

```cljs
(fn ()) ; -> function() { return (void 0); }
(fn () (random 100)) ; -> function() { return random(100); }
(fn (x) x) ; -> function(x) { return x; }
(fn (x y) (+ x y)) ; -> function(x, y) { return x + y; }
(fn (x ... xs) xs) ; -> function(x) { var xs = Array.prototype.slice.call(arguments, 1); return xs; }
(fn () (read) (stall) (compute)) ; -> function() { read(); stall(); return compute(); }
(fn identity (a) a) ; -> function identity(a) { return a; }
```

### `do`

`do` is the built-in for sequential execution (block creation) as every expression in `eth` must be
an expression / return a value (except `def` and few others).

This one comes especially handy when you want the branch of an `if` to do more than 1 thing.

```cljs
(do (x) (y) (z)) ; -> x(); y(); return z();
(if c (do (a) (b)) ()) ; -> if (c) { a(); return b(); } else { return null; }
```

### other built-ins

| eth | js | description |
|---|---|---|
| `(if (< a b) a b)` | `if (a < b) { return a; } else { return b; }` | Returns the value of the then branch if the given condition is truthy or the else branch if not |
| `(while (< i 5) (set i (+ i 1)))` | `while (i < 5) { i = i + 1; }` | Executes the given body until the condition is falsy, returning the value of the last expression in the body at the end |
| `(throw (Error. "!"))` | `throw new Error('!')` | Takes one argument and throws it as an exception |
| `(set x 5)` | `x = 5` | Assignment |
| `(set (. "x" obj) 5)` | `obj["x"] = 5` | Assignment to object property |
| `(= x 5)` | `x = 5` | Assignment alternate syntax |
| `(get :y obj) | `obj.y` | Dereferencing using a know symbol |
| `(get x obj)` | `obj[x]` | Dereferencing by value  |
| `(get "$%!" obj)` | `obj["$%!"]` | Dereferencing by value (using a string) |
| `(. :y obj)` | `obj.y` | Dereferencing alternate syntax |
| `(def add (x y) (+ x y))` | `add = function(x y) { return x + y; }` | Defines a new function and assign it to a variable |
| `(let ((a 1) (b (+ a 1))) b)` | `a = 1; b = a + 1; return b;` | Defines variables in given definition list then evaluate it's body returning the last expression's value |
| `(package adder (add) (def add ...))` | `add = ...; exports.add = add; window.adder = {add: add};` | Defines a package using a given name and list of exported symbols, it will run it's body in a new closure and export (on the `window` in the brower or using `module.exports` in node) the specified exported symbols |
| `(import http)` | `http = require('http')` | Named import |
| `(import util u)` | `u = require('util')` | Aliased import |
| `(import (str "u" "til") util)` | `util = require('u' + 'til')` | Aliased import (dynamic) |
| `(import http (createServer METHODS))` | `createServer = require('http').createServer; METHODS = require('http').METHODS` | Destructing import |

## standard library

The standard library is, at it's core, composed of all the functions in [Ramda.js](http://ramdajs.com/).
`ramda` is a realy library packed with small utility functions that all have a well designed functionnal
api.

If you are interested in functional programming and using `eth` I then strongly encorage you pass by
ramda's awesome [documentation](http://ramdajs.com/0.21.0/docs/) and read the introductary post
[Why Ramda?](http://fr.umio.us/why-ramda/).

In adition to the functions from `ramda`, `eth` defined a few more useful function like `to-json`,
`print`, `assert` and more. They are all listed below.

```
to-json from-json
print assert
get-in
set-in
type of-type?
null? undefined? boolean? number? string? keyword? symbol? list? array? object? function?
string array object
```

## using eth for your next project

### browser

Eth compiles down to plain JavaScript so you could simply run `eth -c app.eth >app.js` and load
`app.js` in a browser but that only hic is that you won't have access to the nice `import` statements
any more.

To be able to use `import`s (really `require`s) you need to use a module loader / system to bundle
your code for browsers. This implies that there needs to be an integration written for the tool you
are going to choose.

For **Browserify** users there is no `eth` integration yet but if you are up for it this [`soloify`](https://github.com/kiasaki/soloify) project should be a good example to look at.

**If you are using _webpack_** you can install the [`eth-loader`](https://github.com/kiasaki/eth-loader)
package and use it like so:

```
// webpack.config.js
module.exports = {
  entry: './src/app.eth',
  output: {path: './build', filename: 'app.js'},
  module: {
    loaders: [{test: /\.eth$/, loader: 'eth-loader'}]
  }
};
```

### node

The story here is similar that that of CoffeeScript or TypeScript, you have mainly two option:
compiling all files and running those with `node` or using node.js `require.extensions` to register
a handler for files with a specific extension, `.eth` in our case (this is clearly not production
worthy).

**Option 1: Compiling and running**

Here a simple `Makefile` that looks like the following can come in super handy:

```make
ETH := node_modules/.bin/eth

FILES = server.js models.js routes.js
TEST_FILES = test/models.js test/routes.js

default: run

%.js: %.eth
    $(ETH) -c $< >$@

run: build
  node server.js

build: $(FILES) $(TEST_FILES)

test: build
    node -r ./test/models.js ./test/routes.js

clean:
    @rm -rf *.js
    @rm -rf test/*.js
```
**Option 2: Require extension**

This version of getting `.eth` files to run on node.js is by far the easiest, it consists in having
a `.js` file the simply requires `eth/register` followed by your `server.eth`, from that point on
all `require`s resolving to `.eth` file will get compiled first, then ran.

```js
// bootstrap.js
require('eth/register');
require('./server');
```

_See the [`examples/node/`](https://github.com/kiasaki/eth-lang/tree/master/examples/node) folder
for an example of both of those methods in action._

### library

You will probably want to have two directories, say `src` for `.eth` source files and a `lib` or
`build` folder for compiled javascript.

That way people consuming your library don't even need to know it is written in `eth` and still use
it. To get there you'll simply have to make sure that you build all necessary `.js` files before
commiting changes and have a line that looks like `"main": "build/index.js"` in your `package.json`.

## developing

**The compiler** for the language is all in `eth-lang.js` and is still way under 1000 lines.

**The repl/cli tool** is implemented in `bin/eth`.

**The standard library** is written in `eth` and is located in the `core.eth` file. If you make changes to
the standard library you can recompile the `.js` file for use in `npm` using the `make build` command.

To run the test suite simply run:

```
make test
```

## license

See `LICENSE` file.
