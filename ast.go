package fnk

import (
	"bytes"
	"fmt"
)

type NodeType string

const (
	TypeTop    NodeType = "top"
	TypeUnit            = "unit"
	TypeBool            = "bool"
	TypeChar            = "char"
	TypeString          = "string"
	TypeInt             = "int"
	TypeFloat           = "float"
	TypeVar             = "var"
	TypeMap             = "map"
	TypeList            = "list"

	TypeLet    NodeType = "let"
	TypeLetDef          = "let-def"

	TypeModule NodeType = "module"
	TypeImport          = "import"
)

type Node struct {
	Type     NodeType
	Data     string
	Args     []string
	Children []*Node
	Parent   *Node
	File     string
	Line     int
	Col      int
}

type AST struct {
	Root *Node
}

func (a *AST) String() string {
	var b bytes.Buffer
	for _, child := range a.Root.Children {
		child.Print(&b, "")
	}
	return b.String()
}

func NewNode(t NodeType, i item, p *Node, file string) *Node {
	return &Node{
		Type:     t,
		Data:     i.val,
		Children: []*Node{},
		Parent:   p,
		File:     file,
		Line:     i.line,
		Col:      i.col,
	}
}

func (n *Node) Print(b *bytes.Buffer, pad string) {
	fmt.Fprintf(b, "%s%s:%d:%d %s(%q)", pad, n.File, n.Line, n.Col, n.Type, n.Data)
	if len(n.Args) > 0 {
		fmt.Fprintf(b, " %v", n.Args)
	}
	b.WriteRune('\n')

	for _, child := range n.Children {
		child.Print(b, pad+"  ")
	}
}

func (n *Node) SetChildren(children []*Node) *Node {
	n.Children = children
	return n
}
