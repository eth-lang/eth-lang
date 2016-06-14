{
open Lexing
open Parser

exception SyntaxError of string

let comment_depth = ref 0

let next_line lexbuf =
  let pos = lexbuf.lex_curr_p in
  lexbuf.lex_curr_p <-
    { pos with pos_bol = lexbuf.lex_curr_pos;
               pos_lnum = pos.pos_lnum + 1
    }
}

let int = '-'? ['0'-'9'] ['0'-'9']*
let digit = ['0'-'9']
let frac = '.' digit*
let exp = ['e' 'E'] ['-' '+']? digit+
let float = digit* frac? exp?
let white = [' ' '\t']+
let newline = '\r' | '\n' | "\r\n"
let id = ['a'-'z' 'A'-'Z' '_' '-'] ['a'-'z' 'A'-'Z' '0'-'9' '_' '-']*

rule read =
  parse
  | white    { read lexbuf }
  | newline  { next_line lexbuf; read lexbuf }
  | "True"   { BOOL (true) }
  | "False"  { BOOL (false) }
  | int      { INT (int_of_string (Lexing.lexeme lexbuf)) }
  | float    { FLOAT (float_of_string (Lexing.lexeme lexbuf)) }
  | '''      { read_char lexbuf }
  | '"'      { read_string (Buffer.create 17) lexbuf }
  | "(*"     { comment_depth := 1; comment lexbuf }
  | '('      { LPAREN }
  | ')'      { RPAREN }
  | '{'      { LBRACE }
  | '}'      { RBRACE }
  | '['      { LBRACK }
  | ']'      { RBRACK }
  | '='      { EQUAL }
  | ";;"     { SEMISEMI }
  | ';'      { SEMI }
  | ','      { COMMA }
  | "let"    { LET }
  | "and"    { AND }
  | "in"     { IN }
  | "if"     { IF }
  | "then"   { THEN }
  | "else"   { ELSE }
  | id       { IDENT (Lexing.lexeme lexbuf) }
  | eof      { EOF }
  | _ { raise (SyntaxError ("Unexpected char: " ^ Lexing.lexeme lexbuf)) }

and read_char =
  parse
  | '\''
    { raise (SyntaxError ("Empty char is not allowed")) }
  | '\\' '\'' '\'' { CHAR ('\'') }
  | '\\' '/' '\''  { CHAR ('/') }
  | '\\' '\\' '\'' { CHAR ('\\') }
  | '\\' 'b' '\''  { CHAR ('\b') }
  | '\\' 'f' '\''  { CHAR ('\012') }
  | '\\' 'n' '\''  { CHAR ('\n') }
  | '\\' 'r' '\''  { CHAR ('\r') }
  | '\\' 't' '\''  { CHAR ('\t') }
  | [^ '\'' '\\'] '\''
    { CHAR (String.get (Lexing.lexeme lexbuf) 0) }
  | eof
    { raise (SyntaxError ("Char is not terminated")) }
  | _
    { raise (SyntaxError ("Illegal char with more than one character: " ^ Lexing.lexeme lexbuf)) }

and read_string buf =
  parse
  | '"'       { STRING (Buffer.contents buf) }
  | '\\' '"'  { Buffer.add_char buf '"'; read_string buf lexbuf }
  | '\\' '/'  { Buffer.add_char buf '/'; read_string buf lexbuf }
  | '\\' '\\' { Buffer.add_char buf '\\'; read_string buf lexbuf }
  | '\\' 'b'  { Buffer.add_char buf '\b'; read_string buf lexbuf }
  | '\\' 'f'  { Buffer.add_char buf '\012'; read_string buf lexbuf }
  | '\\' 'n'  { Buffer.add_char buf '\n'; read_string buf lexbuf }
  | '\\' 'r'  { Buffer.add_char buf '\r'; read_string buf lexbuf }
  | '\\' 't'  { Buffer.add_char buf '\t'; read_string buf lexbuf }
  | [^ '"' '\\']+
    { Buffer.add_string buf (Lexing.lexeme lexbuf);
      read_string buf lexbuf
    }
  | eof
    { raise (SyntaxError ("String is not terminated")) }
  | _
    { raise (SyntaxError ("Illegal string character: " ^ Lexing.lexeme lexbuf)) }

and comment =
  parse
  | "(*"
    { comment_depth := !comment_depth + 1; comment lexbuf }
  | "*)"
    { comment_depth := !comment_depth - 1;
      if !comment_depth > 0 then comment lexbuf else read lexbuf }
  | newline
    { next_line lexbuf; comment lexbuf }
  | eof
    { raise(SyntaxError ("Comment not terminated")) }
  | _
    { comment lexbuf }
