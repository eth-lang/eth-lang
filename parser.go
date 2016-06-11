package fnk

import (
	"fmt"
	"io/ioutil"
	"strings"
)

var (
	SPECIAL_FN = &Node{
		Type: itemIdentifier,
		Data: "\\",
	}

	SPECIAL_DO = &Node{
		Type: itemIdentifier,
		Data: ">",
	}

	SPECIAL_DEF = &Node{
		Type: itemIdentifier,
		Data: "=",
	}

	SPECIAL_CALL = &Node{
		Type: itemIdentifier,
		Data: "?",
	}

	SPECIAL_IF = &Node{
		Type: itemIdentifier,
		Data: "!",
	}

	SPECIAL_LIST_GET = &Node{
		Type: itemIdentifier,
		Data: ",",
	}

	SPECIAL_LIST_SET = &Node{
		Type: itemIdentifier,
		Data: ";",
	}

	SPECIAL_MAP_GET = &Node{
		Type: itemIdentifier,
		Data: ".",
	}

	SPECIAL_MAP_SET = &Node{
		Type: itemIdentifier,
		Data: ":",
	}
)

func createIdent(name string) *Node {
	return &Node{
		Type: itemIdentifier,
		Data: name,
	}
}

func isSpecialIdent(ident string) bool {
	specialIdents := []string{
		"\\", ">", "=", "?", "!", ",", ";", ".", ":",
	}

	for _, specialIdent := range specialIdents {
		if specialIdent == ident {
			return true
		}
	}

	return false
}

func isFunctionArgsExpr(n *Node) bool {
	if n.Parent.Children[0].Data != "\\" {
		return false
	}
	if len(n.Parent.Children) >= 2 && n.Parent.Children[1] != n {
		return false
	}
	return true
}

func createExpr(nodes []*Node) *Node {
	return &Node{
		Type:     itemExpression,
		Children: nodes,
	}
}

func createEmptyExpr() *Node {
	return &Node{
		Type:     itemExpression,
		Children: []*Node{},
	}
}

func createBody(nodes []*Node) *Node {
	if len(nodes) == 1 {
		return nodes[0]
	} else {
		return createExpr(nodes)
	}
}

func ensureParents(n *Node) {
	for _, child := range n.Children {
		child.Parent = n
		if isParent(child.Type) {
			ensureParents(child)
		}
	}
}

func ParseFile(ast *AST, file string) (err error) {
	fileIndex, new := ast.addFile(file)

	if !new {
		return fmt.Errorf("Parsing duplicate file %q", file)
	}

	data, err := ioutil.ReadFile(file)
	if err != nil {
		return
	}

	return parse(ast, string(data), fileIndex)
}

func Parse(ast *AST, data string) (err error) {
	fileIndex, _ := ast.addFile("<raw data>")

	return parse(ast, data, fileIndex)
}

func parse(ast *AST, data string, fileIndex int) (err error) {
	err = p1Newlines(ast, data, fileIndex)
	if err != nil {
		return err
	}

	// STAGE 1 order, hierarchy

	// TYPE CHECK validation

	// STAGE 2 expension to lower level constructs

	err = p3Assignment(&ast.Root, ast.Files)
	if err != nil {
		return err
	}

	err = p3Module(&ast.Root, ast.Files)
	if err != nil {
		return err
	}

	err = p3Let(&ast.Root, ast.Files)
	if err != nil {
		return err
	}

	err = p3AssignmentFn(&ast.Root, ast.Files)
	if err != nil {
		return err
	}

	err = p3IdentDot(&ast.Root, ast.Files)
	if err != nil {
		return err
	}

	ensureParents(&ast.Root)
	err = p3ExpressionToFunctionCall(&ast.Root, ast.Files)
	if err != nil {
		return err
	}

	// group expressions separated by ,
	// add default module
	// validate duplicate modules

	// STAGE 3 optimisation

	return nil
}

func p1Newlines(ast *AST, data string, fileIndex int) (err error) {
	appendItem := func(n *Node, i item) {
		n.Children = append(n.Children, &Node{
			File:   fileIndex,
			Line:   i.line,
			Col:    i.col,
			Data:   i.val,
			Type:   i.typ,
			Parent: n,
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

	ast.Root.Type = itemRoot
	ast.Root.Children = append(ast.Root.Children, createExpr([]*Node{
		createIdent("module"),
		createIdent("Main"),
		createExpr([]*Node{createIdent("main")}),
		createIdent("where"),
	}))
	module := ast.Root.Children[len(ast.Root.Children)-1]
	appendExpression(module)
	ensureParents(module)

	node := module.Children[len(module.Children)-1]

	lex := lex(ast.Files[fileIndex], data)

	i := lex.nextItem()
	for i.typ != itemEOF {
		switch i.typ {
		case itemError:
			return NewParseError(ast.Files[fileIndex], i.line, i.col, i.val)
		case itemNewLine:
			// handle special newline cases
			// but always skip adding it to the ast
			break
		case itemSeparator:
			// HACK remove once we have a pass handling them
			break
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
		case itemExpressionOpen:
			appendExpression(node)
			node = node.Children[len(node.Children)-1]
		case itemExpressionClose:
			node = node.Parent
		default:
			// if we are at the beginning of a line, start a new expression
			if i.col == 0 && len(node.Children) > 0 {
				// TODO check expression is terminated
				// TODO backout to top level
				// start a new expression and set that as our current node
				appendExpression(node.Parent)
				node = node.Parent.Children[len(node.Parent.Children)-1]
			}

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

func p3Assignment(n *Node, files []string) error {
	var name *Node = nil
	var args []*Node = []*Node{}

	for i, child := range n.Children {
		switch t := child.Type; {
		case isParent(t):
			if err := p3Assignment(child, files); err != nil {
				return err
			}
		case t == itemIdentifier && child.Data == "=":
			if i == 0 {
				return NewParseError(files[child.File], child.Line, child.Col, "Found assignment expression (=) but missing name identifier to the left")
			}
			if i == len(n.Children)-1 {
				return NewParseError(files[child.File], child.Line, child.Col, "Found assignment expression (=) but missing expression to its right")
			}
			expr := n.Children[i+1:]

			// TODO check all args are plain identifiers
			// TODO check name is identifier
			// TODO check name is not taken?

			name.Parent = n
			child.Parent = n
			target := n

			targetBody := &Node{
				Type:     itemExpression,
				Children: expr,
				Parent:   target,
			}
			if len(expr) == 1 {
				targetBody = expr[0]
				targetBody.Parent = n
			}

			/*
				if target.Type != itemExpression {
					target.Children = []*Node{&Node{Parent: target}}
					target = target.Children[0]
				}
			*/
			target.Type = itemExpression
			if len(args) == 0 {
				// Assignment 0 args
				target.Children = []*Node{
					child,
					name,
					targetBody,
				}
			} else {
				// Assignment fn (takes 1+ args)
				target.Children = []*Node{
					child,
					name,
					&Node{
						Type:     itemExpression,
						Children: args,
						Parent:   target,
					},
					targetBody,
				}
			}
			return nil
		case t == itemIdentifier && i == 0:
			name = child
		case t == itemIdentifier:
			args = append(args, child)
		}
	}

	return nil
}

func p3Module(n *Node, files []string) error {
	body := n.Children

	if n.Type == itemExpression &&
		len(n.Children) > 3 &&
		n.Children[0].Type == itemIdentifier &&
		n.Children[0].Data == "module" {

		exposed := []*Node{}
		body := n.Children[3:]
		if n.Children[2].Type == itemExpression {
			exposed = n.Children[2].Children
			body = n.Children[4:]
		}

		n.Children = []*Node{
			SPECIAL_DEF,
			createIdent(n.Children[1].Data),
			createExpr([]*Node{
				SPECIAL_CALL,
				createExpr([]*Node{
					SPECIAL_FN,
					createExpr([]*Node{}),
					createExpr(append(body, &Node{
						Type:     itemMap,
						Children: exposed,
					})),
				}),
			}),
		}
	}

	for _, child := range body {
		if isParent(child.Type) {
			if err := p3Module(child, files); err != nil {
				return err
			}
		}
	}
	return nil
}

func p3Let(n *Node, files []string) error {
	var letNode *Node
	var foundLet = false
	var foundIn = false

	var assignments = []*Node{}
	var body = []*Node{}

	for i, child := range n.Children {
		switch t := child.Type; {
		case isParent(t):
			if err := p3Let(child, files); err != nil {
				return err
			}
		case t == itemIdentifier && child.Data == "let":
			if i != 0 {
				return NewParseError(files[child.File], child.Line, child.Col, "Found let expression but in the middle of an other expression, let should be first")
			}
			letNode = child
			foundLet = true
		case t == itemIdentifier && child.Data == "in":
			foundIn = true
		case foundLet && foundIn:
			body = append(body, child)
		case foundLet:
			assignments = append(assignments, child)
		}
	}

	if foundLet && !foundIn {
		return NewParseError(files[letNode.File], letNode.Line, letNode.Col, "Found let expression but couldn't find corresponding 'in' identifier")
	}

	if foundLet && foundIn {
		target := n
		if target.Type != itemExpression {
			target.Children = []*Node{&Node{Parent: target}}
			target = target.Children[0]
		}

		targetAssignments := &Node{
			Type:     itemExpression,
			Children: assignments,
		}
		p3Assignment(targetAssignments, files)

		target.Type = itemExpression
		target.Children = []*Node{
			SPECIAL_CALL,
			createExpr([]*Node{
				SPECIAL_FN,
				createEmptyExpr(),
				createExpr([]*Node{
					targetAssignments,
					&Node{
						Type:     itemExpression,
						Children: body,
					},
				}),
			}),
		}
	}

	return nil
}

func p3AssignmentFn(n *Node, files []string) error {
	for i, child := range n.Children {
		switch t := child.Type; {
		case isParent(t):
			if err := p3AssignmentFn(child, files); err != nil {
				return err
			}
		default:
			// If current expr looks like (= name (...) ...)
			if t == itemIdentifier && child.Data == "=" && i == 0 &&
				len(n.Children) >= 4 {
				// replace (args) body with a new function
				targetArgs := n.Children[2]
				n.Children = []*Node{
					SPECIAL_DEF,
					n.Children[1], // name
					&Node{
						Type: itemExpression,
						Children: []*Node{
							SPECIAL_FN,
							targetArgs,
							createBody(n.Children[3:]),
						},
					},
				}
			}
		}
	}
	return nil
}

func p3IdentDot(n *Node, files []string) error {
	for _, child := range n.Children {
		if isParent(child.Type) {
			if err := p3IdentDot(child, files); err != nil {
				return err
			}
		} else if child.Type == itemIdentifier {
			identParts := strings.Split(child.Data, ".")
			if len(identParts) == 2 {
				child.Type = itemExpression
				child.Children = []*Node{
					SPECIAL_MAP_GET,
					createIdent(identParts[1]),
					createIdent(identParts[0]),
				}
			}
		}
	}
	return nil
}

func p3ExpressionToFunctionCall(n *Node, files []string) error {
	if n.Type == itemExpression &&
		len(n.Children) > 1 &&
		n.Children[0].Type == itemIdentifier &&
		!isFunctionArgsExpr(n) &&
		!isSpecialIdent(n.Children[0].Data) {

		// Make this expr a call
		callee := n.Children[0]
		callArgs := n.Children[1:]
		n.Children = []*Node{
			SPECIAL_CALL,
			callee,
			createBody(callArgs),
		}
		ensureParents(n)
	}

	for _, child := range n.Children {
		if isParent(child.Type) {
			if err := p3ExpressionToFunctionCall(child, files); err != nil {
				return err
			}
		}
	}
	return nil
}

func parseXXX(n *Node, files []string) error {
	for _, child := range n.Children {
		if isParent(child.Type) {
			if err := parseXXX(child, files); err != nil {
				return err
			}
		} else if child.Type == itemIdentifier {
		}
	}
	return nil
}
