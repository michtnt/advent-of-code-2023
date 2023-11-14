#!/bin/bash
if [ -z "$1" ]
  then
    echo "You must pass through a folder name!"
    exit 1
fi

if [ -d "./$1" ]
  then
    echo "$1 directory already exist!"
    exit 1
fi

echo "Creating $1 directory 🛠️ . ."

mkdir $1
cd $1
touch "$1".test.ts index.ts input.txt README.md

echo "All files are created in $1 directory 🍻!"