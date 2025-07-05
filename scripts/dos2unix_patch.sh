#!/bin/bash

# Convert all .sh files to Unix line endings
find ./ -name "*.sh" -exec dos2unix {} \;