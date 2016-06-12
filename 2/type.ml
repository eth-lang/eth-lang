type t =
  | Unit
  | Bool
  | Int
  | Float
  | Char
  | String
  | Fun of t list * t
  | Tuple of t list
  | List of t
  | Var of t option ref

let gentyp () = Var(ref None)
