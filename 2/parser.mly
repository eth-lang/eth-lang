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
%token SEMI
%token COMMA
%token LET
%token REC
%token AND
%token IN
%token IF
%token THEN
%token ELSE
%token EOF

%right prec_let
%right SEMI
%right prec_if
%left prec_app


%type <Syntax.t> exp
%start <Syntax.t option> prog

%%

prog:
| EOF
    { None }
| e = exp EOF
    { Some e }

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

exp:
| simple_exp
    { $1 }
| IF exp THEN exp ELSE exp
    %prec prec_if
    { If($2, $4, $6) }
| LET IDENT EQUAL exp IN exp
    %prec prec_let
    { Let(addtyp $2, $4, $6) }
| LET REC fundef IN exp
    %prec prec_let
    { LetRec($3, $5) }
| exp actual_args
    %prec prec_app
    { App($1, $2) }
| elems
    { Tuple($1) }
| LET LPAREN pat RPAREN EQUAL exp IN exp
    { LetTuple($3, $6, $8) }
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
    %prec prec_app
    { $1 @ [$2] }
| simple_exp
    %prec prec_app
    { [$1] }

elems_semi:
| elems_semi SEMI exp
    { $1 @ [$3] }
| exp SEMI exp
    { [$1; $3] }

elems:
| elems COMMA exp
    { $1 @ [$3] }
| exp COMMA exp
    { [$1; $3] }

pat:
| pat COMMA IDENT
    { $1 @ [addtyp $3] }
| IDENT COMMA IDENT
    { [addtyp $1; addtyp $3] }
