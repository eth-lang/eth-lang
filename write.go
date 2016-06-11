package fnk

import (
	"bytes"
	"fmt"
	"strings"
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
		fmt.Fprintf(b, " # %s", n.Data)
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

	if n.Type == itemMap {
		fmt.Fprintf(b, "%s{}", pad)
		return
	}

	if isParent(n.Type) {
		fmt.Fprintf(b, "\n%s(", pad)

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

func WriteJS(ast *AST) string {
	var b bytes.Buffer
	for _, node := range ast.Root.Children {
		writeJSNode(node, "", &b)
	}

	out := b.String()
	out = strings.Replace(out, ";;", ";", -1)
	out = strings.Replace(out, ";;", ";", -1)
	return out
}

func writeJSNode(n *Node, pad string, b *bytes.Buffer) {
	if n.Type == itemComment {
		return
	}

	if n.Type == itemBool {
		b.WriteString(strings.ToLower(n.Data))
		return
	}

	if n.Type == itemString {
		fmt.Fprintf(b, "\"%s\"", n.Data)
		return
	}

	if n.Type == itemChar {
		fmt.Fprintf(b, "\"%s\"", strings.Replace(n.Data, "\\'", "'", -1))
		return
	}

	if n.Type == itemExpression && len(n.Children) > 0 &&
		n.Children[0].Type == itemIdentifier {
		switch t := n.Children[0].Data; {
		case t == "=" && len(n.Children) == 3 && n.Children[1].Type == itemIdentifier:
			fmt.Fprintf(b, "\n%svar %s = %s;", pad, n.Children[1].Data, valueStr(n.Children[2], pad+"  "))
			return

		case t == "\\" && len(n.Children) == 3:
			var argsStr = writeJSIdentList(n.Children[1])

			var body = n.Children[2].Children
			var fnContent = &bytes.Buffer{}
			fmt.Fprintf(fnContent, "\n%s", pad)
			if len(body) == 1 {
				// write as return (body);
				fnContent.WriteString("\nreturn " + valueStr(n.Children[2], pad+"  "))
			} else {
				// write as body[0]; return body[1];

				// TODO handle specials in body's 1st position
				for i, childNode := range body {
					var value bytes.Buffer
					writeJSNode(childNode, pad, &value)
					if i == len(body)-1 {
						fnContent.WriteString("\n  " + pad + "return ")
						fnContent.WriteString(strings.TrimLeft(value.String(), " \n"))
						continue
					}
					if i > 0 {
						fnContent.WriteRune(' ')
					}
					fnContent.WriteString(value.String())
				}
				fmt.Fprintf(fnContent, ";")
			}
			fmt.Fprintf(b, "\n%sfunction(%s) {\n%s%s\n%s}", pad, argsStr, pad, strings.TrimSpace(fnContent.String()), pad)
			return

		case t == "?" && len(n.Children) >= 2:
			var argsStr string
			if len(n.Children) == 3 {
				argsStr = writeJSIdentList(n.Children[2])
			}
			fmt.Fprintf(b, "\n%s%s(%s);", pad, valueStr(n.Children[1], pad+"  "), argsStr)
			return

		case t == "." && len(n.Children) == 3 && n.Children[2].Type == itemIdentifier:
			fmt.Fprintf(b, "%s%s[\"%s\"]", pad, n.Children[2].Data, valueStr(n.Children[1], pad+"  "))
			return

		case t == ">":
			n.Children = n.Children[1:]
			writeJSNode(n, pad, b)
			return
		}
	}

	if n.Type == itemExpression {
		fmt.Fprintf(b, "\n%s", pad)
		for i, childNode := range n.Children {
			if i > 0 {
				b.WriteRune(' ')
			}
			writeJSNode(childNode, pad+"  ", b)
		}
		fmt.Fprintf(b, ";")
	} else {
		fmt.Fprintf(b, "%s", n.Data)
	}
}

func writeJSIdentList(n *Node) string {
	if n.Type == itemIdentifier {
		return n.Data
	}

	list := ""
	for i, argNode := range n.Children {
		if i != 0 {
			list += " "
		}
		list += argNode.Data
	}
	return list
}

func valueStr(n *Node, pad string) string {
	var value bytes.Buffer
	writeJSNode(n, pad, &value)
	return strings.TrimSpace(value.String())
}
