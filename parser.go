package fnk

import (
	"io/ioutil"
)

func ParseFile(ast *AST, file string) error {
	data, err := ioutil.ReadFile(file)
	if err != nil {
		return err
	}

	return parse(ast, string(data), file)
}

func Parse(ast *AST, data string) (err error) {
	return parse(ast, data, "<raw data>")
}

func parse(ast *AST, data string, file string) (err error) {
	lex := lex(file, data)
	i := lex.nextItem()
	for i.typ != itemEOF {
		switch i.typ {
		case itemError:
			return NewParseError(file, i.line, i.col, i.val)
		}
		i = lex.nextItem()
	}

	return nil
}
