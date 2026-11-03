# 📬 SendKit - Telegram Messaging for Agents

SendKit is a TypeScript toolkit for sending Telegram messages from developer tools and AI agents. It provides one shared, Zod-validated Telegram operation through a command-line interface, a local Model Context Protocol (MCP) server, and an authenticated remote MCP server.

The CLI stores a bot token in a local configuration file for manual use. The local MCP server reads its token from the process environment, while the remote MCP service authenticates MCP requests with Clerk and receives a bot token as part of the service route.

<p align="center">
  <img width="1299" height="466" alt="Screenshot 2026-11-03 at 13 02 15" src="https://github.com/user-attachments/assets/beace14e-486a-43f5-af0b-605ec4e1b3ab" />
</p>

## ✨ Features

### Telegram Messaging

- Send messages to any Telegram chat accessible by the configured bot
- Validate chat IDs, message text, and bot tokens with Zod
- Return a consistent `{ ok, chatId, messageId }` result
- Surface Telegram API error descriptions when a request fails

### CLI

- Configure a bot token with `sendkit init`
- Send messages with `sendkit telegram <chatId> <message>`
- Store local CLI credentials at `~/.config/sendkit/config.json`
- Write the local configuration with restrictive `0600` permissions
- Run from a package manager without a global install through `bunx` or `npx`

### MCP Integrations

- Use the `telegram` tool from an MCP-compatible agent
- Run the local MCP server over standard input/output
- Configure Claude-compatible MCP clients and OpenCode with example files
- Expose a streamable HTTP MCP endpoint for remote deployments
- Protect remote MCP requests with Clerk OAuth authentication

### Shared Core

- Reuse the same Telegram implementation across every integration
- Convert the camelCase SDK input into Telegram Bot API `chat_id` and `text` fields
- Keep request, response, and output contracts typed and runtime-validated
- Build the core package independently for reuse by downstream packages

## 🛠️ Tech Stack

### Runtime and Language

- **[Bun](https://bun.sh/)** - Workspace package manager, script runner, and development runtime
- **[TypeScript](https://www.typescriptlang.org/)** - Strict type-safe development
- **[Zod](https://zod.dev/)** - Runtime validation for inputs and API responses

### Packages and Interfaces

- **[Commander](https://github.com/tj/commander.js)** - CLI command and option parsing
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - Agent-facing local and remote tool interfaces
- **[Hono](https://hono.dev/)** - Lightweight HTTP application for the remote MCP server
- **[Clerk](https://clerk.com/)** - OAuth request authentication for the remote MCP server

### External API

- **[Telegram Bot API](https://core.telegram.org/bots/api)** - Message delivery through `sendMessage`

## 🚀 Getting Started

### Prerequisites

- Bun
- A Telegram bot token created through [BotFather](https://t.me/BotFather)
- A Telegram chat ID where the bot is allowed to send messages
- Clerk publishable and secret keys when running the remote MCP server

### Install Dependencies

```bash
bun install
```

### Configure Environment Variables

Copy `.env.example` to `.env` for local development. Do not commit credentials or production secrets.

```env
TELEGRAM_BOT_TOKEN=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

`TELEGRAM_BOT_TOKEN` is required by the local MCP server. `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are required by the remote MCP server.

### Use the CLI

Build the CLI package, configure a token, and send a message:

```bash
bun run build:cli
bun run packages/cli/dist/index.js init --telegram-bot-token "<YOUR_TELEGRAM_BOT_TOKEN>"
bun run packages/cli/dist/index.js telegram "<CHAT_ID>" "Hello from SendKit"
```

After installing the published package, the equivalent commands are:

```bash
bunx @lazarshock/sendkit init --telegram-bot-token "<YOUR_TELEGRAM_BOT_TOKEN>"
bunx @lazarshock/sendkit telegram "<CHAT_ID>" "Hello from SendKit"
```

The CLI prints a JSON result similar to:

```json
{ "ok": true, "chatId": "123456789", "messageId": 42 }
```

### Configure a Local MCP Client

Use the structure in `example.mcp.json` and replace the placeholder token:

```json
{
  "mcpServers": {
    "sendkit": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@lazarshock/sendkit-mcp"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "<YOUR_TELEGRAM_BOT_TOKEN>"
      }
    }
  }
}
```

The server exposes a `telegram` tool with these inputs:

| Field     | Type   | Required | Description      |
| --------- | ------ | -------: | ---------------- |
| `chatId`  | string |      Yes | Telegram chat ID |
| `message` | string |      Yes | Message text     |

The bot token is supplied through the MCP server environment and is not part of the tool input.

### Run the Remote MCP Server

The remote server uses Hono and exposes a streamable HTTP MCP endpoint at:

```text
POST /<botToken>/mcp
```

It also serves Clerk protected-resource metadata at:

```text
GET /.well-known/oauth-protected-resource/<botToken>/mcp
```

Start it locally with:

```bash
bun run dev:remote-mcp
```

Set `PORT` to change the default port of `3000`. Deploy the service behind HTTPS and configure the MCP client with the deployed endpoint and Clerk OAuth settings.

## 📜 Available Scripts

- `bun install` - Install workspace dependencies
- `bun run typecheck` - Run the TypeScript compiler without emitting files
- `bun run lint` - Run Oxlint with warnings denied
- `bun run lint:fix` - Apply available Oxlint fixes
- `bun run format` - Format the repository with Oxfmt
- `bun run format:check` - Check repository formatting
- `bun run build:core` - Build `@lazarshock/sendkit-core`
- `bun run build:cli` - Build `@lazarshock/sendkit`
- `bun run build:local-mcp` - Build `@lazarshock/sendkit-mcp`
- `bun run dev:cli` - Run the CLI source directly
- `bun run dev:local-mcp` - Run the local MCP server over stdio
- `bun run dev:remote-mcp` - Run the remote MCP server
- `bun run release:pack:core` - Build and dry-run package creation for the core package
- `bun run release:pack:cli` - Build and dry-run package creation for the CLI
- `bun run release:pack:local-mcp` - Build and dry-run package creation for the local MCP server

## 🗂️ Project Structure

```text
apps/
└── remote-mcp/
    └── src/index.ts          # Clerk-protected streamable HTTP MCP server
packages/
├── core/
│   └── src/
│       ├── index.ts          # Public core exports
│       ├── operations.ts    # Telegram Bot API operation
│       └── schemas.ts       # Types and Zod schemas
├── cli/
│   └── src/index.ts          # sendkit CLI and local config handling
└── local-mcp/
    └── src/index.ts          # stdio MCP server
skills/
└── sendkit/
    └── SKILL.md              # Agent guidance for choosing MCP or CLI
example.mcp.json              # Generic stdio MCP client configuration
example.opencode.json         # OpenCode MCP configuration template
```
