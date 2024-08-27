#!/bin/bash
# This script changes the name of the search index files from underscores to dashes.
# Move to the locales directory
cd ./locales

# Loop through all directories
for dir in *-*; do
  # Print out the directory name being processed
  echo "Processing directory: $dir"

  # Find the JSON file with an underscore in the name
  for file in "$dir"/*_*; do
    if [ -f "$file" ]; then
      # Convert underscore to hyphen in the filename
      newfile=$(echo "$file" | sed 's/_/-/g')
      # Rename the JSON file
      mv "$file" "$newfile"
      echo "Renamed $file to $newfile"
    fi
  done
done

# Go back to the previous directory
cd -
