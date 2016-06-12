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
	itemParensOpen
	itemParensClose
	itemListOpen
	itemListClose
	itemMapOpen
	itemMapClose
	itemSeparator
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
	case itemParensOpen:
		return "expressionOpen"
	case itemParensClose:
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
	default:
		return "unknown"
	}
}
