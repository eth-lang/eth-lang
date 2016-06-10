package fnk

import (
	"bytes"
	"fmt"
)

func Write(ast *AST) string {
	var b bytes.Buffer
	for _, node := range ast.Root.Children {
		writeNode(node, "", &b)
	}
	return b.String()
}

func writeNode(n *Node, pad string, b *bytes.Buffer) {
	if n.Type == itemComment {
		fmt.Fprintf(b, "%s# %s", pad, n.Data)
		return
	}

	if n.Type == itemString {
		fmt.Fprintf(b, "\"%s\"", n.Data)
		return
	}

	if n.Type == itemChar {
		fmt.Fprintf(b, "'%s'", n.Data)
		return
	}

	if n.Type == itemExpression || n.Type == itemModule {
		if n.Type == itemModule {
			fmt.Fprintf(b, "%s(module %s\n", pad, n.Data)
		} else {
			fmt.Fprintf(b, "\n%s(", pad)
		}

		for i, childNode := range n.Children {
			if i > 0 {
				b.WriteRune(' ')
			}
			writeNode(childNode, pad+"  ", b)
		}
		fmt.Fprintf(b, ")")
	} else {
		fmt.Fprintf(b, "%s", n.Data)
	}
}
