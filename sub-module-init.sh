#!/bin/bash
echo "building all submodules while checking out from master branch."

git submodule update --init --recursive
git submodule foreach git checkout main 
git submodule foreach git pull origin main 

cd ../ui-starter-app/
git submodule update --init --recursive
git checkout main
