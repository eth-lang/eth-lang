package fnk

import (
	"io/ioutil"
)

func ParseFile(ast *AST, file string) error {
	data, err := ioutil.ReadFile(file)
	if err != nil {
		return err
	}

	return parse(ast, string(data), file)
}

func Parse(ast *AST, data string) (err error) {
	return parse(ast, data, "<raw data>")
}

func parse(ast *AST, data string, file string) (err error) {
	lex := lex(file, data)
	tok := lex.nextItem()

	// initialise AST
	if ast.Root == nil {
		ast.Root = &Node{
			Children: []*Node{},
		}
	}

	var moduleNode *Node
	if tok, moduleNode, err = parseModule(ast, lex, file, tok); err != nil {
		return err
	}

	// parse top level
	for tok.typ != itemEOF {
		if tok.typ == itemError {
			return NewParseError(file, tok.line, tok.col, tok.val)
		}
		if tok.typ == itemComment || tok.typ == itemNewLine || tok.typ == itemSemicolon {
			// ignore comments, newlines and semicolons until we hit something interesting
			tok = lex.nextItem()
			continue
		}
		if tok.typ == itemIdentifier && tok.val == "import" {
			// TODO handle imports
			tok = lex.nextItem()
			continue
		}
		if tok.typ == itemIdentifier && tok.val == "let" {
			if tok, err = parseLet(moduleNode, lex, file, tok); err != nil {
				return err
			}
		}
		return NewTokenTypeMisMatchError(file, tok, "keyword let or import at top level")
	}

	return nil
}

func parseLet(parent *Node, lex *lexer, file string, tok item) (item, error) {
	var err error
	letNode := NewNode(TypeLet, tok, parent, file)

	for tok != itemIdentifier || tok != "in" {
		if tok, err = parseLetDef(parent, lex, file, tok); err != nil {
			return tok, err
		}
	}

	// skip 'in'
	tok := lex.nextItem()
	// parse assignment value till ';'
	if err := parseExpr(letDefNode, lex, file); err != nil {
		return tok, err
	}

	appendChild(parent, letNode)
	return tok, nil
}

func parseLetDef(parent *Node, lex *lexer, file string, tok item) (item, error) {
	tok := lex.nextItem()
	letDefNode := NewNode(TypeLetDef, tok, parent, file)
	letDefNode.Data = ""
	appendChild(parent, letDefNode)

	for tok.typ != itemIdentifier || tok.val != "=" {
		if tok.typ != itemIdentifier {
			return tok, NewTokenTypeMisMatchError(file, tok, "only identifiers on left side of let '='")
		}
		if letDefNode.Data == "" {
			// set let def name
			letDefNode.Data = tok.val
		} else {
			// append let def function arg
			letDefNode.Args = append(letDefNode.Args, tok.val)
		}
		tok := lex.nextItem()
	}

	if len(letDefNode.Args) == 0 {
		return tok, NewParseError(file, letDefNode.Line, tok.Col, "Expected at least one identifier to the left of '=' in let expression")
	}

	// skip '='
	tok := lex.nextItem()
	// parse assignment value till 'and' or 'in'
	if err := parseExpr(letDefNode, lex, file); err != nil {
		return tok, err
	}

	return tok, nil
}

func parseModule(ast *AST, lex *lexer, file string, tok item) (item, *Node, error) {
	var moduleNode *Node

	// skip comments
	for tok.typ == itemComment || tok.typ == itemNewLine {
		tok = lex.nextItem()
	}

	if tok.typ == itemIdentifier && tok.val == "module" {
		// parse module
		moduleLine := tok.line
		moduleCol := tok.col
		tok = lex.nextItem()
		if tok.typ != itemIdentifier {
			return tok, nil, NewTokenTypeMisMatchError(file, tok, "module name")
		}

		moduleNode = NewNode(TypeModule, tok, ast.Root, file)
		moduleNode.Line = moduleLine
		moduleNode.Col = moduleCol

		tok = lex.nextItem()
		if tok.typ == itemParensOpen {
			// parse exported identifiers
			tok = lex.nextItem()
			for tok.typ != itemParensClose {
				if tok.typ != itemIdentifier {
					return tok, nil, NewTokenTypeMisMatchError(file, tok, "module export")
				}
				moduleNode.Args = append(moduleNode.Args, tok.val)
				tok = lex.nextItem()
			}
			// skip the close parens
			tok = lex.nextItem()
		}

		if tok.typ != itemIdentifier || tok.val != "where" {
			return tok, nil, NewTokenTypeMisMatchError(file, tok, "module 'where' keyword")
		}

		tok = lex.nextItem()
		appendChild(ast.Root, moduleNode)
	} else {
		// append default Main module
		moduleNode = &Node{
			Type: TypeModule,
			Data: "Main",
			File: file,
			Line: 0,
			Col:  0,
		}
		appendChild(ast.Root, moduleNode)
	}

	return tok, moduleNode, nil
}

func NewTokenTypeMisMatchError(file string, tok item, why string) error {
	return NewParseError(
		file, tok.line, tok.col, "Expected %s, got %q of type '%s'",
		why, tok.val, tok.typ,
	)
}

func appendChild(parent *Node, node *Node) int {
	parent.Children = append(parent.Children, node)
	node.Parent = parent
	return len(parent.Children) - 1
}
