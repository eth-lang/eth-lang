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

	if tok, err = parseModule(ast, lex, file, tok); err != nil {
		return err
	}

	// parse top level
	for tok.typ != itemEOF {
		if tok.typ == itemError {
			return NewParseError(file, tok.line, tok.col, tok.val)
		}
		if tok.typ == itemComment || tok.typ == itemNewLine {
			// ignore comments and newlines until we hit something interesting
			tok = lex.nextItem()
			continue
		}
		if tok.typ == itemIdentifier && tok.val == "import" {
			// TODO handle imports
			tok = lex.nextItem()
			continue
		}
		if tok.typ == itemIdentifier && tok.val == "let" {
			if err = parseTopLevel(ast, lex, file); err != nil {
				return err
			}
		}
		return NewTokenTypeMisMatchError(file, tok, "keyword let or import at top level")
	}

	return nil
}

func parseTopLevel(ast *AST, lex *lexer, file string) error {
	return nil
}

func parseModule(ast *AST, lex *lexer, file string, tok item) (item, error) {
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
			return tok, NewTokenTypeMisMatchError(file, tok, "module name")
		}

		moduleNode := NewNode(TypeModule, tok, ast.Root, file)
		moduleNode.Line = moduleLine
		moduleNode.Col = moduleCol

		tok = lex.nextItem()
		if tok.typ == itemParensOpen {
			// parse exported identifiers
			tok = lex.nextItem()
			for tok.typ != itemParensClose {
				if tok.typ != itemIdentifier {
					return tok, NewTokenTypeMisMatchError(file, tok, "module export")
				}
				moduleNode.Args = append(moduleNode.Args, tok.val)
				tok = lex.nextItem()
			}
			// skip the close parens
			tok = lex.nextItem()
		}

		if tok.typ != itemIdentifier || tok.val != "where" {
			return tok, NewTokenTypeMisMatchError(file, tok, "module 'where' keyword")
		}

		tok = lex.nextItem()
		appendChild(ast.Root, moduleNode)
	} else {
		// append default Main module
		moduleNode := &Node{
			Type: TypeModule,
			Data: "Main",
			File: file,
			Line: 0,
			Col:  0,
		}
		appendChild(ast.Root, moduleNode)
	}

	return tok, nil
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
