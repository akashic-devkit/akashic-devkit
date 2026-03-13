#!/bin/bash
# Runs prettier and eslint --fix on files modified by Edit or Write tools

FILE=$(node -e "
const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(Buffer.concat(chunks));
    console.log(data.tool_input?.file_path || '');
  } catch {}
});
")

if [ -z "$FILE" ]; then exit 0; fi
if [ ! -f "$FILE" ]; then exit 0; fi

# Run prettier
pnpm exec prettier --write "$FILE" 2>/dev/null

# Run eslint for JS/TS files
if [[ "$FILE" =~ \.(js|ts|tsx|jsx)$ ]]; then
  pnpm exec eslint --fix "$FILE" 2>/dev/null
fi
