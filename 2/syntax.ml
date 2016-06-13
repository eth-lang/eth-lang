type t =
  | Unit
  | Bool of bool
  | Int of int
  | Float of float
  | Char of char
  | String of string
  | If of t * t * t
  | Let of (Id.t * Type.t) * t * t
  | Var of Id.t
  | LetRec of fundef * t
  | App of t * t list
  | Tuple of t list
  | LetTuple of (Id.t * Type.t) list * t * t
  | List of t list
and fundef = { name : Id.t * Type.t; args : (Id.t * Type.t) list; body : t }

open Core.Std
let rec output_value outc = function
  | Unit              -> output_string outc "()"
  | Bool true         -> output_string outc "True"
  | Bool false        -> output_string outc "False"
  | Int i             -> printf "%d" i
  | Float x           -> printf "%f" x
  | Char c            -> printf "'%c'" c
  | String s          -> printf "\"%s\"" s
  | If(_, _, _)       -> output_string outc "if"
  | Let((_, Type.Unit), e1, e2) -> print_let outc "()" e1 e2
  | Let((i, typ), e1, e2) -> print_let outc i e1 e2
  | Var i             -> printf "%s" i
  | LetRec(_, _)      -> output_string outc "letrec"
  | App(c, a)         -> print_app outc c a
  | Tuple l           -> print_tuple outc l
  | LetTuple(_, _, _) -> output_string outc "lettuple"
  | List l            -> print_list outc l

and print_let outc ident e1 e2 =
  output_string outc "let ";
  output_string outc ident;
  output_string outc " = ";
  output_value outc e1;
  output_string outc " in ";
  output_value outc e2;

and print_app outc callee args =
  output_value outc callee;
  output_string outc " ";
  List.iteri ~f:(fun i v ->
    if i > 0 then
      output_string outc " ";
    output_value outc v) args;

and print_tuple outc arr =
  output_string outc "(";
  List.iteri ~f:(fun i v ->
      if i > 0 then
        output_string outc "; ";
      output_value outc v) arr;
  output_string outc ")"

and print_list outc arr =
  output_string outc "[";
  List.iteri ~f:(fun i v ->
      if i > 0 then
        output_string outc "; ";
      output_value outc v) arr;
  output_string outc "]"

and print_map outc obj =
  output_string outc "{ ";
  let sep = ref "" in
  List.iter ~f:(fun (key, value) ->
      printf "%s%s = %a" !sep key output_value value;
      sep := ";\n  ") obj;
  output_string outc " }"
