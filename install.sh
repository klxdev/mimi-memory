#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting installation of mimi CLI...${NC}"

# 1. Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# 2. Build the project
echo -e "${BLUE}Building packages...${NC}"
npm run build

# 3. Link the CLI package globally
echo -e "${BLUE}Linking CLI globally...${NC}"
cd packages/cli
npm link --force

echo -e "${GREEN}Success! The 'mimi' command has been installed.${NC}"
echo -e "${GREEN}Try running: mimi --help${NC}"
