package fnk

import (
	"bytes"
	"fmt"
)

type Node struct {
	Data     string
	Children []*Node
	Parent   *Node
	Line     int
	Col      int
	File     int
	Type     itemType
}

type AST struct {
	Root  Node
	Files []string
}

func (a *AST) addFile(file string) (idx int, new bool) {
	for i, name := range a.Files {
		if name == file {
			return i, false
		}
	}

	a.Files = append(a.Files, file)
	return len(a.Files) - 1, true
}

func (a *AST) String() string {
	var b bytes.Buffer

	fmt.Fprintf(&b, "files:\n")
	for i, file := range a.Files {
		fmt.Fprintf(&b, "- %d: %q\n", i, file)
	}

	fmt.Fprintf(&b, "nodes:\n")
	for _, childNode := range a.Root.Children {
		a.printNode(childNode, "  ", &b)
	}

	return b.String()
}

func (a *AST) printNode(n *Node, pad string, b *bytes.Buffer) {
	fmt.Fprintf(b, "%s%d:%03d:%03d %s(%q)\n",
		pad, n.File, n.Line, n.Col, n.Type, n.Data)

	for _, childNode := range n.Children {
		a.printNode(childNode, pad+"  ", b)
	}
}
