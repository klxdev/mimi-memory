# mimi-memory CLI

A CLI tool for AI agents to store and retrieve memory using a hybrid graph/vector approach.

## Installation

```bash
npm install
npm run build
```

## Configuration

Create a file at `~/.mimi/settings.json`. You can use `packages/cli/sample-settings.json` as a template.

### Example: Local Embedding Provider (Default)

This setup uses a local model for embeddings (no API key required) and a mock/placeholder for text generation.

```json
{
  "providers": {
    "local": {
      "type": "local",
      "model": "Xenova/all-MiniLM-L6-v2"
    }
  },
  "pipeline": {
    "episodic": {
      "provider": "local",
      "prompt": "Extract episodic memory..."
    }
  }
}
```

## Usage

### Add Memory

```bash
node packages/cli/dist/index.js add "I met Alice at the cafe." --project "personal"
```

### Search Memory

```bash
node packages/cli/dist/index.js query "Alice cafe"
```

### List Memories

```bash
node packages/cli/dist/index.js list
```
