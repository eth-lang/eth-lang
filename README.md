# fnk lang

_A funky, experimental, functional, to JS language to play with._

## intro

_WARNING! This is a research project and a lot of information here might become outdated and misleading without any explanation. Don't use it for anything important just yet!_

**fnk** language is a not quite an ML language but draws inspiration from this
family of functional languages. It compiles down to a small intermediary
language that is then translated to JavaScript.

This compiler is build of an initial lexing pass but then the parser will apply
many small function or passes to the AST slowly transforming higher level
concepts in lower level constituents and validating many rule the related to
the guarantees the language give and it's type system.

## goals

- fun!
- guaranteed immutable
- a lot of currying
- definitively typed
- possibly performant
- merely useful

## compiler passes

The compiler being organized in a successions of small functions each aiming to
_parse_, _validate_ or _optimize_ the AST in a specific way, documenting them
here should help you understand what's going on between input source code and
outputted code.

- Lexing (emits a flat array of tokens)
- Phase 1 > Structure
  - `p1Newlines` Parse incoming tokens and group them in expressions based on newlines and whitespace
  - `p1Separators` TODO group tokens in between commas in expressions if needed
  - `p1Assignment` TODO group assignment expressions branches in expressions if needed
  - `p1Let` TODO group let expressions branches in expressions if needed
  - `p1If` TODO group if expressions branches in expressions if needed
- Phase 2 > Validation & Types
  - This phase is still quite nebulous (read absent)
- Phase 3 > Expansion
  - `p3Assignment` Expand assignment to intermediary syntax
  - `p3Let` Expand let expressions to a new scope, a set of assignments and return value
  - `p3AssignmentFn` Expand assignment with args to new function syntax
  - `p3Curry` TODO Expand functions with multiple args to curried form
  - `p3IdentDot` Expand `Console.log` identifiers to the `. log Console` form
- Phase 4 > Optimisation
  - Nothig here yet but reorders, drops and shortens expressions for speed gains

## intermediary language

**fnk** internally targets compiling all it's expression the small subset of
operations that can then be directly translated the target language concepts
and syntax. This opens the door for multiple backends for the language.

- `(expr*)` expression, uses for grouping and scope
- `\ (expr*) body` declare anonymous function
- `! expr expr expr` define if then else
- `? fn expr*` call functions with args
- `= ident expr` assign expression to name
- `, int list` get item at index from list
- `; int expr list` set item at index in list
- `. ident map` get item at key from map
- `: ident expr map` set item at key in map

## intermediary language (example)

As an example the (as of writing) `example.fnk` looks like:

```
# This is a single line comment

someBool = True
someNumber = 45
someFloat = 9.99
someHex = 0xDEEDBEEF

sayHello = "supports escaped quotes: \""

singleQuoteChat = '\''

add x y = + x y

silly foo =
  let
    foo = 5
  in
    foo

== (silly 12) 5

Console.log "Wowza!"
```

and compiles to:

```
(module Main (main) where
  (= someBool True)
  (= someNumber 45)
  (= someFloat 9.99)
  (= someHex 0xDEEDBEEF)
  (= sayHello "supports escaped quotes: \"")
  (= singleQuoteChat '\'')

  (= add (\ (x y) (+ x y)))

  (= silly
    (\ (foo)
      (? (\ () (>
        (= foo 5)
        (foo))))))

  (== (silly 12) 5)

  ((. log Console) "Wowza!"))
```

## license

See `LICENSE` file.
