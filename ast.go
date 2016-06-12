package fnk

type NodeType string

const (
	TypeExpr NodeType = "expr"
)

type Node struct {
	Type     NodeType
	Data     string
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
	return "AST"
}
