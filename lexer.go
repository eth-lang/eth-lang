package fnk

import (
	"fmt"
	"strings"
	"unicode"
	"unicode/utf8"
)

const eof = rune(0)

const identChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890+-_!?=<>/\\."

type item struct {
	typ  itemType
	val  string
	line int
	col  int
}

func (i item) String() string {
	switch i.typ {
	case itemEOF:
		return "EOF"
	case itemError:
		return i.val
	}

	if len(i.val) > 20 {
		return fmt.Sprintf("%v(%.20q...)", i.typ, i.val)
	}

	return fmt.Sprintf("%v(%q)", i.typ, i.val)
}

type stateFn func(*lexer) stateFn

type lexer struct {
	name           string // used for error reports
	input          string // the string being scanned
	lastLineLength int    // length last line was (for backing up)
	line           int    // current line
	col            int    // current col
	startLine      int    // last emit current line
	startCol       int    // last emit current col
	start          int    // start of the current item
	pos            int    // current position in the input
	width          int    // width of the last run read
	items          chan item
	state          stateFn
}

func lex(name, input string) *lexer {
	return &lexer{
		name:  name,
		input: input,
		items: make(chan item, 2),
		state: lexCode,
	}
}

func (l *lexer) nextItem() item {
	for {
		select {
		case item := <-l.items:
			return item
		default:
			l.state = l.state(l)
		}
	}
}

func (l *lexer) errorf(format string, args ...interface{}) stateFn {
	l.items <- item{
		typ:  itemError,
		val:  fmt.Sprintf(format, args...),
		line: l.line,
		col:  l.col,
	}
	return nil
}

func (l *lexer) emit(t itemType) {
	l.items <- item{
		typ:  t,
		val:  l.input[l.start:l.pos],
		line: l.startLine,
		col:  l.startCol,
	}
	l.startLine = l.line
	l.startCol = l.col
	l.start = l.pos
}

func (l *lexer) next() (r rune) {
	if l.pos >= len(l.input) {
		l.width = 0
		return eof
	}
	r, l.width = utf8.DecodeRuneInString(l.input[l.pos:])
	l.pos += l.width

	// update line info
	if r == '\n' {
		l.lastLineLength = l.col
		l.line++
		l.col = 0
	} else {
		l.col++
	}

	return r
}

func (l *lexer) ignore() {
	l.startLine = l.line
	l.startCol = l.col
	l.start = l.pos
}

func (l *lexer) backup() {
	// update line info
	if l.col == 0 {
		l.line--
		l.col = l.lastLineLength
	} else {
		l.col--
	}

	l.pos -= l.width
}

func (l *lexer) peek() rune {
	r := l.next()
	l.backup()
	return r
}

func lexCode(l *lexer) stateFn {
	for {
		switch r := l.next(); {
		case r == eof:
			l.emit(itemEOF)
			return nil
		case r == '#':
			if l.accept(" ") {
				l.ignore()
				return lexSingleLineComment
			}
			fallthrough
		case r == '\n':
			l.ignore()
			l.emit(itemNewLine)
		case isSpace(r):
			l.ignore()
		case r == '"':
			return lexString
		case r == '\'':
			return lexChar
		case r == 'T':
			l.backup()
			if l.acceptLiteral("True", itemBool) {
				return lexCode
			}
			fallthrough
		case r == 'F':
			l.backup()
			if l.acceptLiteral("False", itemBool) {
				return lexCode
			}
			fallthrough
		case unicode.IsDigit(r):
			l.backup()
			return lexNumber
		case r == '(':
			l.ignore()
			l.emit(itemExpressionOpen)
			return lexCode
		case r == ')':
			l.ignore()
			l.emit(itemExpressionClose)
			return lexCode
		case r == '[':
			l.ignore()
			l.emit(itemListOpen)
			return lexCode
		case r == ']':
			l.ignore()
			l.emit(itemListClose)
			return lexCode
		case r == '{':
			l.ignore()
			l.emit(itemMapOpen)
			return lexCode
		case r == '}':
			l.ignore()
			l.emit(itemMapClose)
			return lexCode
		case r == ',':
			l.ignore()
			l.emit(itemSeparator)
			return lexCode
		case strings.IndexRune(identChars, r) >= 0:
			l.backup()
			return lexIdentifier
		}
	}
}

func lexSingleLineComment(l *lexer) stateFn {
	l.acceptUntil("\n")
	l.emit(itemComment)
	return lexCode
}

func lexIdentifier(l *lexer) stateFn {
	l.pos++
	l.acceptRun(identChars)
	l.emit(itemIdentifier)
	return lexCode
}

func lexString(l *lexer) stateFn {
	l.ignore()

	var last rune
	for {
		switch r := l.next(); {
		case r == eof:
			l.emit(itemEOF)
			return nil
		case r == '"':
			if last != '\\' {
				l.backup()
				l.emit(itemString)
				l.next()
				l.ignore()
				return lexCode
			}
			fallthrough
		default:
			last = r
		}
	}
}

func lexChar(l *lexer) stateFn {
	l.ignore()

	var last rune
	for {
		switch r := l.next(); {
		case r == eof:
			l.emit(itemEOF)
			return nil
		case r == '\'':
			if last != '\\' {
				l.backup()
				l.emit(itemChar)
				l.next()
				l.ignore()
				return lexCode
			}
			fallthrough
		default:
			last = r
		}
	}
}

func lexNumber(l *lexer) stateFn {
	digits := "0123456789"

	if l.accept("0") && l.accept("xX") {
		digits = "0123456789abcdefABCDEF"
	} else if l.accept("0") && l.accept("bB") {
		digits = "01"
	} else if l.accept("0") && l.accept("oO") {
		digits = "01234567"
	}

	l.acceptRun(digits)

	if l.peek() == '.' {
		l.next()
		l.acceptRun(digits)
	}

	l.emit(itemNumber)
	return lexCode
}

func (l *lexer) accept(valid string) bool {
	if strings.IndexRune(valid, l.next()) >= 0 {
		return true
	}
	l.backup()
	return false
}

func (l *lexer) acceptRun(valid string) {
	for strings.IndexRune(valid, l.next()) >= 0 {
	}
	l.backup()
}

func (l *lexer) acceptUntil(valid string) {
	for strings.IndexRune(valid, l.next()) < 0 {
	}
	l.backup()
}

func (l *lexer) acceptLiteral(lit string, t itemType) bool {
	if l.input[l.start:l.start+len(lit)] == lit {
		for l.pos < l.start+len(lit) {
			l.next()
		}
		l.emit(t)
		return true
	}
	return false
}

func isSpace(r rune) bool {
	return unicode.IsSpace(r)
}

func isAlphaNumeric(r rune) bool {
	return unicode.IsLetter(r) || unicode.IsDigit(r)
}
