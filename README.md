# mcp-statbank-md

National Bureau of Statistics of Moldova (Statbank) PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `subjects` | Navigate the database/subject tree. Root (empty path) lists databases ({dbid}). Drill into a database id to get folders (type "l") and tables (type "t", ".px" suffix). |
| `table_meta` | Fetch dimension definitions and valid coded values for a Moldova Statbank PxWeb table. Path must end in the '.px' table id (e.g. '20 Populatia si procesele demografice/POP010/POPro/POP010100rcl.px'). Returns dimensions with codes and value lists — use these to build the selection body for query_table. |
| `query_table` | POST a PxWeb query to a Moldova National Bureau of Statistics (Statbank) table and return observations as json-stat2. body must be {query:[{code, selection:{filter,values}}], response:{format:'json-stat2'}}. PxWeb caps responses at ~10,000 cells — narrow each dimension's values using codes from table_meta. |

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
