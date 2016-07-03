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

_(Not really nice way of writing it but it demos language features XD See `hello-compact.eth` for a
more node.js style version of the above)_

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
| Keyword | `:key` | `':key:'` | Keywords are use to express unique names more tersly than using strings and is used by the `.` builtin. The translate to strings starting and ending with `:` |
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
| `danger!` | `danger$` | `!` is not a valid in JavaScript keyword but often used in lisp |
| `healed?` | `isHealed` | `?` is not a valid in JavaScript keyword but often used in lisp |
| `(SomeClass. ...)` | `new SomeClass(...)` | The keywords ending in dot will be translated to the instantiation of the given class |

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
| `(|| 1 2)` | `1 || 2` | |
| `(&& 1 2)` | `1 && 2` | |
| `(== 1 2)` | `1 === 2` | No need to use `===`. `==` translates to it. |
| `(!= 1 2)` | `1 !== 2` | No need to use `!==`. `!=` translates to it. |
| `(! false)` | `!false` | |
| `(fn (a) (+ a 1))` | `function(a) { return a + 1; }` | Declares an anomymous function returning the last expression in it's body |
| `(do (a) (b))` | `a(); return b();` | Executes it's body and returns the value of the last expression |
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

**basics**

| function | description |
|---|---|
| `(assert condition ^bool message ^string)` | Throws an assertion error if `cond` is falsy |
| `(apply f ^function args ^array)` | Call function with given arguments array |
| `(curry f ^function ...args ^any)` | Returns a function that when called will call the given function with the given `args` concatenated with the call's arguments |
| `(curry2 f ^function)` | Returns a function that must be called 2 times with 1 argument before it call the given function with those |
| `(curry3 f ^function)` | Returns a function that must be called 3 times with 1 argument before it call the given function with those |
| `(curryN n ^number f ^function)` | Returns a function that can be called any number of time with any number of arguments until `n` arguments have been given, at this point it will call the given `f` |

**math**

| function | description |
|---|---|
| `(add ...a ^number)` | Sums all the given numbers |
| `(sub a ^number ...as ^number)` | Substracts the given numbers from the first one |
| `(mul ...a ^number)` | Multiples all the given numbers together |
| `(div ...a ^number)` | Divides all the given numbers together |
| `(mod a ^number b ^number)` | Returns the reminder of the division of `a` with `b` |
| `PI ^number` | PI Constant |
| `(abs a ^number)` | Returns the absolute of a number |
| `(ceil a ^number)` | Returns the smallest integer greater than or equal to a number |
| `(floor a ^number)` | Returns the largest integer less than or equal to a number |
| `(log a ^number)` | Returns the natural logarithm of a number |
| `(sin a ^number)` | Returns the sine of a number |
| `(cos a ^number)` | Returns the cosine of a number |
| `(tan a ^number)` | Returns the tangent of a number |
| `(pow base ^number exp ^number)` | Returns base to the exponent power (b^e) |
| `(max a ^number b ^number)` | Returns the largest of 2 given numbers |
| `(min a ^number b ^number)` | Returns the smallest of 2 given numbers |
| `(round a ^number)` | Returns the value of a number rounded to the nearest integer |
| `(sqrt a ^number)` | Returns the positive square root of a number |
| `(inc a ^number)` | Returns `a` with 1 added to it |
| `(dec a ^number)` | Returns `a` with 1 substracted from it |
| `(random n ^number?)` | With no arguments return a number from 0 to 1. When given a number returns a pseudo-random number from 0 to `n` |

```
not
even? odd?
len head tail last concat cons append map reduce filter for-each contains
string array object type and or
print identity
keys values merge clone assoc get-in set-in update-in
```

## using eth for your next project

### Browser

Eth compiles down to plain JavaScript so you could simply run `eth -c app.eth >app.js` and load that
in a browser but that only hic is that you won't have the nice `import` statements any more.

To be able to use `import`s (really `require`s) you need to use a module loader / system to bundle
your code for browsers.

**If you are using _webpack_** you can install the `eth-loader` package and use that like so:

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

### Node

... comming up ...

### Library

You will probably want to have two directories, say `src` for `.eth` source files and a `lib` or
`build` folder for compiled javascript.

That way people consuming your library don't even need to know it is written in `eth` and still use
it. To get there you'll simply have to make sure that you build all necessary `.js` files before
commiting changes and have a line that looks like `"main": "build/index.js"` in your `package.json`.

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
