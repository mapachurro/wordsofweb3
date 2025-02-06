#!/bin/bash

# Define source and destination directories
L10N_DIR="l10n/locales"
LOCALES_DIR="locales"

# Iterate through each locale directory in l10n
for locale in "$L10N_DIR"/*; do
    if [ -d "$locale" ]; then
        locale_name=$(basename "$locale")
        src_file="$locale/translation.json"
        dest_dir="$LOCALES_DIR/$locale_name"
        dest_file="$dest_dir/translation.json"

        # Check if translation.json exists in the source
        if [ -f "$src_file" ]; then
            # Ensure the destination directory exists
            if [ -d "$dest_dir" ]; then
                # Move the file without renaming
                mv "$src_file" "$dest_file"
                echo "Moved: $src_file -> $dest_file"
            else
                echo "Skipping $locale_name: Destination directory does not exist"
            fi
        fi
    fi
done

echo "All translation files moved successfully."
