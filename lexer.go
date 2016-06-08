package fnk

import (
	"fmt"
	"strings"
	"unicode"
	"unicode/utf8"
)

const eof = rune(0)

type itemType int

const (
	itemError itemType = iota

	itemEOF
	itemChar
	itemString
	itemNumber
	itemIdentifier
	itemComment
)

func (t itemType) String() string {
	switch t {
	case itemError:
		return "error"
	case itemEOF:
		return "EOF"
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
	default:
		return "unknown"
	}
}

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
		line: l.line,
		col:  l.col,
	}
	l.start = l.pos
}

func (l *lexer) next() (rune rune) {
	if l.pos >= len(l.input) {
		l.width = 0
		return eof
	}
	rune, l.width = utf8.DecodeRuneInString(l.input[l.pos:])
	l.pos += l.width

	// update line info
	if rune == '\n' {
		l.lastLineLength = l.col
		l.line++
		l.col = 0
	} else {
		l.col++
	}

	return rune
}

func (l *lexer) ignore() {
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
	rune := l.next()
	l.backup()
	return rune
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
		case isSpace(r):
			l.ignore()
		case strings.IndexRune("\n\r", r) >= 0:
			l.ignore()
		case r == '"':
			return lexString
		case '0' <= r && r <= '9':
			l.backup()
			return lexNumber
		case isAlphaNumeric(r):
			l.backup()
			return lexIdentifier
		}
	}
}

func lexSingleLineComment(l *lexer) stateFn {
	l.acceptUntil("\n\r")
	l.emit(itemComment)
	return lexCode
}

func lexIdentifier(l *lexer) stateFn {
	l.pos++
	l.acceptRun("abcdefghijklmnopqrstuvwxyz1234567890-_!?=<>/\\")
	l.emit(itemIdentifier)
	return lexCode
}

func lexString(l *lexer) stateFn {
	var last rune
	for {
		switch r := l.next(); {
		case r == eof:
			l.emit(itemEOF)
			return nil
		case r == '"':
			if last == '\\' {
				continue
			}
			l.emit(itemString)
			return lexCode
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

	if l.accept(".") {
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

func isSpace(r rune) bool {
	return unicode.IsSpace(r)
}

func isAlphaNumeric(r rune) bool {
	return unicode.IsLetter(r) || unicode.IsDigit(r)
}
