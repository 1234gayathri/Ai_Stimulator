// In-memory & localStorage dynamic fallback store for server functions when Supabase DB is unreachable

interface MockStore {
  resumes: any[];
  resume_analyses: any[];
  roadmaps: any[];
  modules: any[];
  interview_sessions: any[];
  interview_turns: any[];
  reports: any[];
}

const memoryStore: MockStore = {
  resumes: [],
  resume_analyses: [],
  roadmaps: [],
  modules: [],
  interview_sessions: [],
  interview_turns: [],
  reports: [],
};

export function createMockSupabaseClient(userId: string) {
  const queryBuilder = (table: keyof MockStore) => {
    let filterField: string | null = null;
    let filterValue: any = null;
    let limitVal: number | null = null;
    let orderField: string | null = null;
    let orderAsc = false;

    const builder = {
      select: (fields?: string) => builder,
      eq: (field: string, val: any) => {
        filterField = field;
        filterValue = val;
        return builder;
      },
      order: (field: string, { ascending = false } = {}) => {
        orderField = field;
        orderAsc = ascending;
        return builder;
      },
      limit: (n: number) => {
        limitVal = n;
        return builder;
      },
      single: async () => {
        const res = await builder.execute();
        return { data: res.data?.[0] || null, error: res.data?.[0] ? null : { message: "Not found" } };
      },
      maybeSingle: async () => {
        const res = await builder.execute();
        return { data: res.data?.[0] || null, error: null };
      },
      insert: async (dataToInsert: any) => {
        const items = Array.isArray(dataToInsert) ? dataToInsert : [dataToInsert];
        const inserted = items.map((item) => ({
          id: item.id || (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `mock_${Math.random().toString(36).slice(2)}`),
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item,
        }));
        memoryStore[table].push(...inserted);

        return {
          data: Array.isArray(dataToInsert) ? inserted : inserted[0],
          error: null,
          select: () => ({
            single: async () => ({ data: inserted[0], error: null }),
            then: (resolve: any) => resolve({ data: inserted, error: null }),
          }),
        };
      },
      update: (dataToUpdate: any) => {
        return {
          eq: (field: string, val: any) => {
            const list = memoryStore[table];
            const updated: any[] = [];
            list.forEach((item) => {
              if (item[field] === val) {
                Object.assign(item, dataToUpdate, { updated_at: new Date().toISOString() });
                updated.push(item);
              }
            });
            return {
              data: updated,
              error: null,
              select: () => ({
                single: async () => ({ data: updated[0] || null, error: null }),
                then: (resolve: any) => resolve({ data: updated, error: null }),
              }),
            };
          },
        };
      },
      delete: () => {
        return {
          eq: (field: string, val: any) => {
            memoryStore[table] = memoryStore[table].filter((item) => item[field] !== val);
            return Promise.resolve({ data: null, error: null });
          },
        };
      },
      execute: async () => {
        let list = [...(memoryStore[table] || [])];
        if (filterField) {
          list = list.filter((item) => item[filterField!] === filterValue);
        }
        if (orderField) {
          list.sort((a, b) => {
            const valA = a[orderField!];
            const valB = b[orderField!];
            if (valA < valB) return orderAsc ? -1 : 1;
            if (valA > valB) return orderAsc ? 1 : -1;
            return 0;
          });
        }
        if (limitVal !== null) {
          list = list.slice(0, limitVal);
        }
        return { data: list, error: null };
      },
      then: (resolve: any) => {
        builder.execute().then(resolve);
      },
    };
    return builder;
  };

  return {
    from: (table: keyof MockStore) => queryBuilder(table),
    storage: {
      from: (bucket: string) => ({
        download: async (path: string) => {
          return { data: new Blob(["Sample candidate resume content for AI analysis..."]), error: null };
        },
        remove: async (paths: string[]) => {
          return { data: paths, error: null };
        },
      }),
    },
  };
}
