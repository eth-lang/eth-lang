package fnk

import "fmt"

type ParseError struct {
	Line int
	Col  int
	File string
	Msg  string
}

func NewParseError(file string, line int, col int, f string, argv ...interface{}) *ParseError {
	return &ParseError{line, col, file, fmt.Sprintf(f, argv...)}
}

func (e *ParseError) Error() string {
	return fmt.Sprintf("%s:%d:%d %s", e.File, e.Line+1, e.Col, e.Msg)
}
