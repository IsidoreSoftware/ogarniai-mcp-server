# Ogarni.AI MCP Server

MCP server for read-only access to [Ogarni.AI](https://www.ogarni.ai) personal finance data.

## Setup

### 1. Get an API Token

1. Log in at [app.ogarni.ai](https://app.ogarni.ai)
2. Go to **Settings → API Tokens**
3. Create a new token with **read** scope
4. Copy the token (starts with `oai_`)

### 2. Install

#### Claude Code

```bash
claude mcp add ogarniai-mcp-server -e OGARNIAI_API_TOKEN=oai_your_token -- npx -y github:nickkobayashi/ogarni.ai#typescript/ogarniai-mcp-server
```

#### Claude Desktop / Cursor / Windsurf

Add to your MCP config file:

```json
{
  "mcpServers": {
    "ogarniai": {
      "command": "npx",
      "args": ["-y", "github:nickkobayashi/ogarni.ai#typescript/ogarniai-mcp-server"],
      "env": {
        "OGARNIAI_API_TOKEN": "oai_your_token_here"
      }
    }
  }
}
```

#### Local Development

```bash
cd typescript/ogarniai-mcp-server
npm install
npm run build
OGARNIAI_API_TOKEN=oai_your_token node dist/index.js
```

## Available Tools

| Tool | Description |
|------|-------------|
| `ogarniai_list_documents` | List receipts with date filters and sorting |
| `ogarniai_get_document` | Get single receipt details |
| `ogarniai_get_document_image` | Get receipt image |
| `ogarniai_get_document_duplicates` | Get duplicate suggestions for a document |
| `ogarniai_list_categories` | List expense/income categories |
| `ogarniai_list_tags` | List user tags |
| `ogarniai_get_weekly_summary` | Get latest weekly summary |
| `ogarniai_get_weekly_summary_periods` | List available summary periods |
| `ogarniai_get_summary_by_period` | Get summary for a custom date range |
| `ogarniai_get_current_period` | Get summary for a preset period |
| `ogarniai_list_notifications` | List notifications with filters |
| `ogarniai_get_notification` | Get notification details |
| `ogarniai_get_unread_count` | Get unread notification count |
| `ogarniai_list_groups` | List finance groups |
| `ogarniai_get_group` | Get group details |
| `ogarniai_list_mailboxes` | List inbound email addresses |
| `ogarniai_list_dedup_suggestions` | List duplicate suggestions |
| `ogarniai_list_loyalty_accounts` | List loyalty program accounts |
| `ogarniai_list_supported_banks` | List supported banks |
| `ogarniai_get_recurring_expenses` | List recurring expenses |

## Configuration

| Environment Variable | Required | Default | Description |
|---------------------|----------|---------|-------------|
| `OGARNIAI_API_TOKEN` | Yes | - | API token (starts with `oai_`) |
| `OGARNIAI_API_URL` | No | `https://api.ogarni.ai` | API base URL |

## Security

- All tools are read-only
- Token is passed via environment variable, never hardcoded
- Input validated with Zod schemas
- Error messages never expose token values
