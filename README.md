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
(package hello-world (.)
  (import core (*))
  (import http)
  (import util u)

  (def PORT 1337)

  (def server-create (message)
    (http.createServer (fn (req res)
      (res.writeHead 200 {"Content-Type" "text/plain"})
      (res.end message))))

  (def server-listen (server port)
    (let (started (fn () (console.log (u.format "Started listenning on port " port))))
      ((. :listen server) port started)))

  (def server (server-create "Hello homoiconicity, expresiveness and fun times!"))

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

## language builtins

## standard library

## license

See `LICENSE` file.
