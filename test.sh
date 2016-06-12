#!/bin/bash

exitcode=0

for f in test/*.test; do
  expected=$(cat $f.out)
  given=$(fnk $f)
  if [ "$given" != "$expected" ]; then
    exitcode=1

    printf "\e[0;31m"
    echo "[FAIL] $f"

    printf "\e[0m"
    echo "*   Expected:"
    printf "\e[0;31m"
    echo "    $expected"

    printf "\e[0m"
    echo "*   Given:"
    printf "\e[0;31m"
    echo "    $given"

    printf "\e[0m"
  else
    printf "\e[0;32m"
    echo "[  OK] $f"
    printf "\e[0m"
  fi
done

exit $exitcode
