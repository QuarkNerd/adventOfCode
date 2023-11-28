#!/bin/bash
#requires last line to be empty
input=$(dirname "$0")/input

total=0
current=0
while IFS= read -r line
do
  if [ -z "$line" ]
  then
    if [ $current -gt $total ]
    then
      total=$current
    fi
    current=0
  else
    current=$(($line + $current))
  fi
done < "$input"

if [ $current -gt $total ]
then
    total=$current
fi

echo Part one: $total