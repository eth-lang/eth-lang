package fnk

import (
	"fmt"
	"io/ioutil"
)

func ParseFile(ast *AST, file string) (err error) {
	fileIndex, new := ast.addFile(file)

	if !new {
		return fmt.Errorf("Parsing duplicate file %q", file)
	}

	data, err := ioutil.ReadFile(file)
	if err != nil {
		return
	}

	return parseData(ast, string(data), fileIndex)
}

func Parse(ast *AST, data string) (err error) {
	fileIndex, _ := ast.addFile("<raw data>")

	return parseData(ast, data, fileIndex)
}

func parseData(ast *AST, data string, fileIndex int) (err error) {
	var node = &ast.Root

	lex := lex(ast.Files[fileIndex], data)

	i := lex.nextItem()
	for i.typ != itemEOF {
		if i.typ == itemError {
			return NewParseError(ast.Files[fileIndex], i.line, i.col, i.val)
		}
		node.Children = append(node.Children, &Node{
			File: fileIndex,
			Line: i.line,
			Col:  i.col,
			Data: i.val,
			Type: i.typ,
		})
		i = lex.nextItem()
	}

	return nil
}
