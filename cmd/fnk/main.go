package main

import (
	"fmt"
	"os"

	lang "github.com/kiasaki/fnk-lang"
)

func main() {
	if len(os.Args) < 2 {
		runHelp()
	}

	if os.Args[1] == "help" {
		runHelp()
	}

	runRun()
}

func runHelp() {
	fmt.Println(`fnk is a simple functional language that compiles to JS

Usage:

  fnk file.fnk

The commands are:

  help    Show this help message
	  `)
	os.Exit(0)
}

func runRun() {
	ast := lang.AST{}
	err := lang.ParseFile(&ast, os.Args[1])
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Println(ast.String())
	fmt.Println(lang.Write(&ast))
	fmt.Println(lang.WriteJS(&ast))
}
