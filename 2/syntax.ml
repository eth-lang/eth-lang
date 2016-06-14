open Core.Std

type t =
  | TopLevel of t
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

let pad_incr = "  "

let rec output_value pad outc = function
  | TopLevel v        -> output_value pad outc v; fprintf outc "\n\n%s" pad
  | Unit              -> fprintf outc "%s" "()"
  | Bool true         -> fprintf outc "%s" "True"
  | Bool false        -> fprintf outc "%s" "False"
  | Int i             -> fprintf outc "%d" i
  | Float x           -> fprintf outc "%f" x
  | Char c            -> fprintf outc "'%s'" (Char.escaped c)
  | String s          -> fprintf outc "\"%s\"" (String.escaped s)
  | Var i             -> fprintf outc "%s" i
  | If(c, e1, e2)     -> print_if pad outc c e1 e2
  | App(c, a)         -> print_app pad outc c a
  | Tuple l           -> print_tuple pad outc l
  | List l            -> print_list pad outc l
  | LetRec(_, _)      -> fprintf outc "%s" "letrec"
  | LetTuple(_, _, _) -> fprintf outc "%s" "lettuple"
  | Let((_, Type.Unit), e1, e2) -> print_let pad outc "()" e1 e2
  | Let((i, typ), e1, e2) -> print_let pad outc i e1 e2

and print_if pad outc c e1 e2 =
  fprintf outc "if ";
  output_value (pad ^ pad_incr) outc c;
  fprintf outc " then\n%s%s" pad pad_incr;
  output_value (pad ^ pad_incr)  outc e1;
  fprintf outc "\n%selse\n%s%s" pad pad pad_incr;
  output_value (pad ^ pad_incr) outc e2;

and print_let pad outc ident e1 e2 =
  fprintf outc "let %s = \n%s%s" ident pad pad_incr;
  output_value (pad ^ pad_incr) outc e1;
  match e2 with
    | Unit -> ()
    | e    ->
      fprintf outc "\n%sin\n%s%s" pad pad pad_incr;
      output_value (pad ^ pad_incr) outc e2;

and print_app pad outc callee args =
  output_value pad outc callee;
  output_string outc " ";
  List.iteri ~f:(fun i v ->
    if i > 0 then
      output_string outc " ";
    output_value pad outc v) args;

and print_tuple pad outc arr =
  output_string outc "(";
  List.iteri ~f:(fun i v ->
      if i > 0 then
        output_string outc "; ";
      output_value pad outc v) arr;
  output_string outc ")"

and print_list pad outc arr =
  output_string outc "[";
  List.iteri ~f:(fun i v ->
      if i > 0 then
        output_string outc "; ";
      output_value pad outc v) arr;
  output_string outc "]"

and print_map pad outc obj =
  output_string outc "{ ";
  let sep = ref "" in
  List.iter ~f:(fun (key, value) ->
    printf "%s%s = " !sep key;
    output_value pad outc value;
    sep := ";\n  ") obj;
  output_string outc " }"
