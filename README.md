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
    (http.createServer (fn (req res)
      (res.writeHead 200 {"Content-Type" "text/plain"})
      (res.end message))))

  (def server-listen (server port)
    (let (started (fn () (console.log (u.format "Started listenning on port " port))))
      ((. :listen server) port started)))

  (set server (server-create "Hello homoiconicity, expresiveness and fun times!"))

  ; And here we go!
  (server-listen server PORT))
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
| Comment | `; comment` | `` | Eth only has single line comments and the don't aprear in compiled code |
| Null | `null` | `null` | Null is simply written null |
| Boolean | `true` | `true` | Booleans are the same as in JavaScript |
| String | `"asd"` | `'asd'` | Strings are always double quoted and support multiline/new lines |
| Numbers | `-1.23` | `-1.23` | Numbers are the same as in JavaScript |
| Symbol | `name` | `name` | Symbols represent variables, they will mostly be have like in JavaScript but see "Special Syntax" for the few special ways you can use them |
| Keyword | `:key` | `':key:'` | Keywords are use to express unique names more tersly than using strings and is used by the `.` builtin. The translate to strings starting and ending with `:` |
| List | `(a b c)` | `a(b, c)` | Lists in list denote function application when evaluated |
| Array | `[1 2 3]` | `[1, 2, 3]` | Arrays are the same as in javascript except that you omit the commas as they are\'t neccessary |
| Object | `{a 1 b 2}` | `{a: 1, b: 2}` | Object are the same as in javascript except that you omit the commas and `:` as they are\'t neccessary |

## special syntax

| eth | js | description |
|---|---|---|
| `a.b` | `a.b` | Having dots in a keyword will translate to the equivalent in javascipt, no need to use `(. b a)` all over the place |
| `@` | `this` | The `@` symbol simply translates `this` |
| `@prop` | `this.props` | The `@` symbol followed by letter thranslate to getting a propperty of `this` |
| `some-fn` | `someFn` | `-` is not a valid in JavaScript but often used in lisp so keywords containing them are camel cased instead |

## language builtins

## standard library

## license

See `LICENSE` file.
