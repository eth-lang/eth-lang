# eth lang

_A fun, experimental and simple lisp transpiler for JavaScript._

[![CircleCI Build Status](https://img.shields.io/circleci/project/kiasaki/eth-lang/master.svg)](https://circleci.com/gh/kiasaki/eth-lang)

## intro

`eth` is a simple lisp that aims to give you the full power of the javascript language
and ecosystem but within the lisp syntax you've come to love. Most things you can write
in javascript you can directly translate to `eth`.

The Lisp syntax being more expressive than JavaScript aided by a few more concepts like
everything being an expression, currying and function composition it becomes easy to let
go of the need for ES6+ and compile those simple concepts directly to ES5 JavaScript
removing the need for setting up the Babel transpiler and friends on top of `eth`.

Here's what a package would look like:

```clj
(package hello-world (server-create server-listen)
  (import eth/core (..))
  (import http)
  (import util u)

  (set PORT 1337)

  (def server-create (message)
    (http.create-server (fn (req res)
      (res.write-head 200 {"Content-Type" "text/plain"})
      (res.end message))))

  (def server-listen! (server port)
    (let (started (fn () (console.log (u.format "Started listenning on port " port))))
      ((. :listen server) port started)))

  (set server (server-create "Hello homoiconicity, expresiveness and fun times!"))

  ; And here we go!
  (server-listen! server PORT))
```

_(Not really nice way of writing it but it demos language features XD)_

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
(+ 3 5)
```

Or run them right away using:

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
| Comment | `; comment` | ` ` | Eth only has single line comments and the don't aprear in compiled code |
| Null | `null` | `null` | Null is simply written null (`()` also evaluates to `null`) |
| Boolean | `true` | `true` | Booleans are the same as in JavaScript |
| String | `"asd"` | `'asd'` | Strings are always double quoted and support multiline/new lines |
| Numbers | `-1.23` | `-1.23` | Numbers are the same as in JavaScript |
| Symbol | `name` | `name` | Symbols represent variables, they will mostly be have like in JavaScript but see "Special Syntax" for the few special ways you can use them |
| List | `(a b c)` | `a(b, c)` | Lists in list denote function application when evaluated |
| Array | `[1 2 3]` | `[1, 2, 3]` | Arrays are the same as in javascript except that you omit the commas as they aren't neccessary |
| Object | `{a 1 b 2}` | `{a: 1, b: 2}` | Object are the same as in javascript except that you omit the commas and `:` as they aren't neccessary |

## special syntax

| eth | js | description |
|---|---|---|
| `a.b` | `a.b` | Having dots in a keyword will translate to the equivalent in javascipt, no need to use `(. b a)` all over the place |
| `@` | `this` | The `@` symbol simply translates `this` |
| `@prop` | `this.prop` | The `@` symbol followed by letter thranslate to getting a propperty of `this` |
| `some-fn` | `someFn` | `-` is not a valid in JavaScript but often used in lisp so keywords containing them are camel cased instead |

## language builtins

| eth | js | description |
|---|---|---|
| `(+ 1 2)` | `1 + 1` | |
| `(- 1 2)` | `1 - 1` | |
| `(* 1 2)` | `1 * 2` | |
| `(/ 1 2)` | `1 / 2` | |
| `(% 3 2)` | `3 % 2` | |
| `(< 1 2)` | `1 < 2` | |
| `(> 1 2)` | `1 > 2` | |
| `(<= 1 2)` | `1 <= 2` | |
| `(>= 1 2)` | `1 >= 2` | |
| `(== 1 2)` | `1 === 2` | No need to use `===`. `==` translates to it. |
| `(!= 1 2)` | `1 !== 2` | No need to use `!==`. `!=` translates to it. |
| `(fn (a) (+ a 1))` | `function(a) { return a + 1; }` | Declares an anomymous function returning the last expression in it's body |
| `(do (a) (b))` | `a(); return b();` | Executes it's body and returns the value of the last expression |
| `(if (< a b) a b)` | `if (a < b) { return a; } else { return b; }` | Returns the value of the then branch if the given condition is truthy or the else branch if not |
| `(while (< i 5) (set i (+ i 1)))` | `while (i < 5) { i = i + 1; }` | Executes the given body until the condition is falsy, returning the value of the last expression in the body at the end |
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

...

## developing

**The compiler** for the language is all in `lib/index.js` and is still way under 1000 lines.

**The repl/cli tool** is implemented in `bin/eth`.

**The standard library** is written in `eth` and is located in the `core` folder. If you make changes to
the standard library you can recompile the `.js` file for use in `npm` using the `make build` command.

To run the test suite simply run:

```
make test
```

## license

See `LICENSE` file.
