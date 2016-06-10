package fnk

type itemType int

const (
	// special
	itemError itemType = iota
	itemEOF

	// basics
	itemBool
	itemChar
	itemString
	itemNumber
	itemIdentifier
	itemComment
	itemNewLine
	itemExpressionOpen
	itemExpressionClose
	itemListOpen
	itemListClose
	itemMapOpen
	itemMapClose
	itemSeparator

	// ast / artificial
	itemRoot
	itemModule
	itemExpression
	itemAssignment
	itemAssignmentName
	itemAssignmentArgs
	itemAssignmentExpr
	itemLet
	itemLetAssignments
	itemLetBody
)

func (t itemType) String() string {
	switch t {
	case itemError:
		return "error"
	case itemEOF:
		return "EOF"

	case itemBool:
		return "bool"
	case itemChar:
		return "char"
	case itemString:
		return "string"
	case itemNumber:
		return "number"
	case itemIdentifier:
		return "identifier"
	case itemComment:
		return "comment"
	case itemNewLine:
		return "newline"
	case itemExpressionOpen:
		return "expressionOpen"
	case itemExpressionClose:
		return "expressionClose"
	case itemListOpen:
		return "listOpen"
	case itemListClose:
		return "listClode"
	case itemMapOpen:
		return "mapOpen"
	case itemMapClose:
		return "mapClose"
	case itemSeparator:
		return "separator"

	case itemRoot:
		return "root"
	case itemModule:
		return "module"
	case itemExpression:
		return "expression"
	case itemAssignment:
		return "assignment"
	case itemAssignmentName:
		return "assignmentName"
	case itemAssignmentArgs:
		return "assignmentArgs"
	case itemAssignmentExpr:
		return "assignmentExpr"
	case itemLet:
		return "let"
	case itemLetAssignments:
		return "letAssignments"
	case itemLetBody:
		return "letBody"

	default:
		return "unknown"
	}
}

func isParent(t itemType) bool {
	return t == itemRoot || t == itemModule || t == itemExpression || t == itemAssignment || t == itemAssignmentExpr || t == itemLet || t == itemLetAssignments || t == itemLetBody
}
