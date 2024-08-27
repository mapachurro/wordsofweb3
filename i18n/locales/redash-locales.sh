#!/bin/bash

# This script is to change all locale directories from en_US to en-US format. Rekt.
# Move to the locales directory

# Loop through all directories
for dir in *_*; do
  # Convert underscore to hyphen
  newdir=$(echo "$dir" | sed 's/_/-/g')
  # Rename the directory
  mv "$dir" "$newdir"
done

# Go back to the previous directory
cd -
