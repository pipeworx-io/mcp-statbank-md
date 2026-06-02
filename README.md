# mcp-statbank-md

National Bureau of Statistics of Moldova (Statbank) PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 693+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `table_meta` | Table definition (dimensions, valid values). Path must end in the ".px" table id. |
| `query_table` | Pull data from a table (POST). body is a PxWeb query object. Keep selected cells under ~10,000. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "statbank-md": {
      "url": "https://gateway.pipeworx.io/statbank-md/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 693+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Statbank Md data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
