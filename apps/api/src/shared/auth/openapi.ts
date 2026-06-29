import { auth } from './auth';

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;

async function getSchema() {
  if (!_schema) {
    _schema = auth.api.generateOpenAPISchema();
  }
  return _schema;
}

export const AuthOpenAPI = {
  getPaths: async (prefix = '/auth/api') => {
    const { paths } = await getSchema();
    const result: typeof paths = Object.create(null);
    for (const path of Object.keys(paths)) {
      const key = prefix + path;
      result[key] = paths[path];
      for (const method of Object.keys(paths[path])) {
        const op = (result[key] as Record<string, unknown>)[method] as Record<string, unknown>;
        if (op) {
          op.tags = ['Better Auth'];
        }
      }
    }
    return result;
  },
  getComponents: async () => {
    const { components } = await getSchema();
    return components;
  },
} as const;
