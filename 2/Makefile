build:
	ocamlbuild -use-menhir -tag thread -use-ocamlfind -quiet -pkg core fnk.native

clean:
	@rm -rf fnk.native
	@rm -rf _build

.PHONY: build clean
