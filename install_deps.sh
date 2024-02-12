#!/bin/bash

# Extract dependencies and attempt to install each one individually
install_deps() {
  # Assuming package.json is in the current directory and jq is installed
  jq -r '.dependencies | to_entries[] | .key + "@" + .value' package.json | while read -r package; do
    npm install "$package" --registry=http://192.168.0.5:8081/repository/npmg/ || echo "Failed to install $package, skipping..."
  done
}

# Call the function to start installation process
install_deps
