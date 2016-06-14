%{
open Syntax

let addtyp x = (x, Type.gentyp ())
%}

%token <bool> BOOL
%token <int> INT
%token <float> FLOAT
%token <Id.t> IDENT
%token <char> CHAR
%token <string> STRING
%token LPAREN
%token RPAREN
%token LBRACE
%token RBRACE
%token LBRACK
%token RBRACK
%token EQUAL
%token SEMISEMI
%token SEMI
%token COMMA
%token LET
%token AND
%token IN
%token IF
%token THEN
%token ELSE
%token EOF

%right prec_let
%right SEMI
%right prec_if


%type <Syntax.t> exp
%start <Syntax.t option> prog

%%

prog:
| EOF
    { None }
| toplevel EOF
    { Some $1 }

toplevel:
| exp SEMISEMI
    { TopLevel $1 }
| LET IDENT EQUAL exp SEMISEMI
    { TopLevel(Let(addtyp $2, $4, Unit)) }
| LET fundef SEMISEMI
    { TopLevel(LetRec($2, Unit)) }

simple_exp:
| LPAREN exp RPAREN
    { $2 }
| LPAREN RPAREN
    { Unit }
| BOOL
    { Bool($1) }
| INT
    { Int($1) }
| FLOAT
    { Float($1) }
| CHAR
    { Char($1) }
| STRING
    { String($1) }
| IDENT
    { Var($1) }
| LBRACK RBRACK
    { List([]) }
| LBRACK elems_semi RBRACK
    { List($2) }
| LBRACE RBRACE
    { Map([]) }
| LBRACE binding_semi RBRACE
    { Map($2) }

exp:
| simple_exp
    { $1 }
| IF exp THEN exp
    %prec prec_if
    { If($2, $4, Unit) }
| IF exp THEN exp ELSE exp
    %prec prec_if
    { If($2, $4, $6) }
| LET IDENT EQUAL exp IN exp
    %prec prec_let
    { Let(addtyp $2, $4, $6) }
| LET fundef IN exp
    %prec prec_let
    { LetRec($2, $4) }
| LET LPAREN pat RPAREN EQUAL exp IN exp
    { LetTuple($3, $6, $8) }
| exp actual_args
    { App($1, $2) }
| elems
    { Tuple($1) }
| exp SEMI exp
    { Let((Id.gentmp Type.Unit, Type.Unit), $1, $3) }
| error
    { failwith
        (Printf.sprintf "parse error near characters %d-%d"
          (Parsing.symbol_start ())
          (Parsing.symbol_end ())) }

fundef:
| IDENT formal_args EQUAL exp
    { { name = addtyp $1; args = $2; body = $4 } }

formal_args:
| IDENT formal_args
    { addtyp $1 :: $2 }
| IDENT
    { [addtyp $1] }

actual_args:
| actual_args simple_exp
    { $1 @ [$2] }
| simple_exp
    { [$1] }

elems_semi:
| elems_semi SEMI simple_exp
    { $1 @ [$3] }
| simple_exp SEMI simple_exp
    { [$1; $3] }

elems:
| elems COMMA exp
    { $1 @ [$3] }
| exp COMMA exp
    { [$1; $3] }

binding_semi:
| binding_semi SEMI IDENT EQUAL simple_exp
    { $1 @ [($3, $5)] }
| IDENT EQUAL simple_exp SEMI IDENT EQUAL simple_exp
    { [($1, $3); ($5, $7)] }

pat:
| pat COMMA IDENT
    { $1 @ [addtyp $3] }
| IDENT COMMA IDENT
    { [addtyp $1; addtyp $3] }
