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
	ast.Root = Node{
		Type: itemModule,
		Data: "Main",
		File: fileIndex,
	}
	ast.Root.Children = append(ast.Root.Children, &Node{
		Type:   itemExpression,
		File:   fileIndex,
		Parent: &ast.Root,
	})
	node := ast.Root.Children[0]

	lex := lex(ast.Files[fileIndex], data)

	appendItem := func(n *Node, i item) {
		n.Children = append(n.Children, &Node{
			File: fileIndex,
			Line: i.line,
			Col:  i.col,
			Data: i.val,
			Type: i.typ,
		})
	}

	appendExpression := func(n *Node) {
		n.Children = append(n.Children, &Node{
			Type:   itemExpression,
			File:   fileIndex,
			Parent: n,
		})
	}

	deleteLastChildren := func(n *Node) {
		n.Children = n.Children[:len(n.Children)-1]
	}

	i := lex.nextItem()
	for i.typ != itemEOF {
		switch i.typ {
		case itemError:
			return NewParseError(ast.Files[fileIndex], i.line, i.col, i.val)
		case itemNewLine:
			if len(node.Children) > 0 {
				// TODO check expression is terminated
				// start a new expression and set that as our current node
				appendExpression(node.Parent)
				fmt.Println(ast)
				node = node.Parent.Children[len(node.Parent.Children)-1]
			}
		case itemComment:
			if node.Type == itemExpression && len(node.Children) == 0 {
				// remove empty expression, add comment, add empty expression
				deleteLastChildren(node.Parent)
				appendItem(node.Parent, i)
				appendExpression(node.Parent)

				// set current node to that new empty expression
				node = node.Parent.Children[len(node.Parent.Children)-1]
			} else {
				appendItem(node, i)
			}
		default:
			appendItem(node, i)
		}

		i = lex.nextItem()
	}

	// if we are left with an empty expression at the end
	if node.Type == itemExpression && len(node.Children) == 0 {
		node.Parent.Children = node.Parent.Children[:len(node.Parent.Children)-1]
	}

	return nil
}
