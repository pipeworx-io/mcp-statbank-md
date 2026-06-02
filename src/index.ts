interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * National Bureau of Statistics of Moldova (Statbank) PxWeb MCP.
 *
 * Keyless PxWeb API. Note the LOWERCASE /pxweb/ in the base path.
 * Navigation: the root returns a list of databases ({dbid, text}); the first
 * path segment must be a database id (e.g. "20 Populatia si procesele demografice").
 * Folders have type "l", tables have type "t" and a ".px" suffix (include it in the path).
 * PxWeb caps a single query response at ~10,000 data cells (the product of the
 * selected value counts across all dimensions); narrow selections to stay under it.
 */


const BASE = 'https://statbank.statistica.md/pxweb/api/v1/en';
const UA = 'pipeworx-mcp-statbank-md/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'subjects',
    description:
      'Navigate the database/subject tree. Root (empty path) lists databases ({dbid}). Drill into a database id to get folders (type "l") and tables (type "t", ".px" suffix).',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Sub-path under /en/ (default empty = root database list). First segment is a database id, e.g. "20 Populatia si procesele demografice/POP010/POPro".' } },
    },
  },
  {
    name: 'table_meta',
    description: 'Table definition (dimensions, valid values). Path must end in the ".px" table id.',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'e.g. "20 Populatia si procesele demografice/POP010/POPro/POP010100rcl.px"' } },
      required: ['path'],
    },
  },
  {
    name: 'query_table',
    description: 'Pull data from a table (POST). body is a PxWeb query object. Keep selected cells under ~10,000.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path ending in the ".px" table id.' },
        body: { type: 'object', description: '{query: [{code, selection: {filter, values}}], response: {format: "json-stat2"}}' },
      },
      required: ['path', 'body'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'subjects': {
      const path = (args.path as string | undefined)?.replace(/^\/+|\/+$/g, '') ?? '';
      return statbankGet(path ? `/${path}` : '/');
    }
    case 'table_meta':
      return statbankGet(`/${reqStr(args, 'path', '"20 Populatia si procesele demografice/POP010/POPro/POP010100rcl.px"').replace(/^\/+|\/+$/g, '')}`);
    case 'query_table': {
      const path = reqStr(args, 'path', '"20 Populatia si procesele demografice/POP010/POPro/POP010100rcl.px"').replace(/^\/+|\/+$/g, '');
      const body = args.body;
      if (!body || typeof body !== 'object') throw new Error('body must be a PxWeb query object.');
      const res = await fetch(`${BASE}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Statbank MD: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
      return res.json();
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function statbankGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Statbank MD: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
