import data from './data.json';

export interface Dun {
  code: string;
  name: string;
}

export interface Parliament {
  code: string;
  name: string;
  dun: Dun[];
}

export interface State {
  name: string;
  parliament: Parliament[];
}

export interface ParliamentSearchResult {
  found: boolean;
  state?: string;
  code?: string;
  name?: string;
  dun?: Dun[];
  results?: {
    state: string;
    code: string;
    name: string;
    dun: Dun[];
  }[];
}

export interface DunSearchResult {
  found: boolean;
  state?: string;
  parliament?: string;
  parliamentCode?: string;
  code?: string;
  name?: string;
  results?: {
    state: string;
    parliament: string;
    parliamentCode: string;
    code: string;
    name: string;
  }[];
}

export interface SearchAllResult {
  found: boolean;
  states: string[];
  parliaments: {
    state: string;
    code: string;
    name: string;
    dun: Dun[];
  }[];
  duns: {
    state: string;
    parliament: string;
    parliamentCode: string;
    code: string;
    name: string;
  }[];
}

export const allData: State[] = data as State[];

// ---------------------------------------------------------------------------
// Preprocessed indices — built once at module load for O(1) lookups
// ---------------------------------------------------------------------------

interface ParliamentEntry {
  state: string;
  code: string;
  name: string;
  dun: Dun[];
}

interface DunEntry {
  state: string;
  parliament: string;
  parliamentCode: string;
  code: string;
  name: string;
}

const allStateNames: string[] = [];
const allParliamentEntries: ParliamentEntry[] = [];
const allDunEntries: DunEntry[] = [];

// O(1) maps
const stateParliamentsMap = new Map<string, Parliament[]>(); // stateLower → parliaments
const parliamentByCode = new Map<string, ParliamentEntry>();  // pCodeLower → entry
const parliamentByName = new Map<string, ParliamentEntry>();  // pNameLower → entry
const dunByName = new Map<string, DunEntry>();                // dunNameLower → entry (names are unique)
const dunsByCode = new Map<string, DunEntry[]>();             // dunCodeLower → entries (codes repeat per state)
const parliamentToState = new Map<string, string>();          // pCode|pName lower → stateName
const dunNameToParliament = new Map<string, ParliamentEntry>(); // dunNameLower → parliament entry

for (const state of allData) {
  const stateLower = state.name.toLowerCase();
  allStateNames.push(state.name);
  stateParliamentsMap.set(stateLower, state.parliament);

  for (const p of state.parliament) {
    const pEntry: ParliamentEntry = { state: state.name, code: p.code, name: p.name, dun: p.dun };
    allParliamentEntries.push(pEntry);

    parliamentByCode.set(p.code.toLowerCase(), pEntry);
    parliamentByName.set(p.name.toLowerCase(), pEntry);
    parliamentToState.set(p.code.toLowerCase(), state.name);
    parliamentToState.set(p.name.toLowerCase(), state.name);

    for (const dun of p.dun) {
      const dEntry: DunEntry = {
        state: state.name,
        parliament: p.name,
        parliamentCode: p.code,
        code: dun.code,
        name: dun.name
      };
      allDunEntries.push(dEntry);
      dunByName.set(dun.name.toLowerCase(), dEntry);
      dunNameToParliament.set(dun.name.toLowerCase(), pEntry);

      const codeLower = dun.code.toLowerCase();
      const existing = dunsByCode.get(codeLower);
      if (existing) {
        existing.push(dEntry);
      } else {
        dunsByCode.set(codeLower, [dEntry]);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

const MAX_CACHE = 5000;
function setCache<T>(cache: Map<string, T>, key: string, value: T): T {
  if (cache.size >= MAX_CACHE) {
    cache.delete(cache.keys().next().value!);
  }
  cache.set(key, value);
  return value;
}

const parliamentSearchCache = new Map<string, ParliamentSearchResult>();
const dunSearchCache = new Map<string, DunSearchResult>();
const searchAllCache = new Map<string, SearchAllResult>();

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

export const getStates = (): string[] => allStateNames;

export const getParliaments = (stateName: string | null): Parliament[] => {
  if (!stateName) return [];
  return stateParliamentsMap.get(stateName.toLowerCase()) ?? [];
};

export const getDuns = (stateName: string | null, parliamentName: string | null): Dun[] => {
  if (!stateName || !parliamentName) return [];

  const parliaments = stateParliamentsMap.get(stateName.toLowerCase());
  if (!parliaments) return [];

  const pLower = parliamentName.toLowerCase();
  const p = parliaments.find(p => p.code.toLowerCase() === pLower || p.name.toLowerCase() === pLower);
  return p ? p.dun : [];
};

export const findParliament = (
  query: string | string[] | null,
  isExactMatch: boolean = true
): ParliamentSearchResult => {
  if (typeof isExactMatch !== 'boolean') isExactMatch = true;
  if (!query) return { found: false };

  if (Array.isArray(query)) {
    const results: ParliamentSearchResult['results'] = [];
    for (const q of query) {
      const r = findParliament(q, isExactMatch);
      if (r.found) {
        if (r.results) results!.push(...r.results);
        else if (r.state && r.code && r.name) results!.push({ state: r.state, code: r.code, name: r.name, dun: r.dun ?? [] });
      }
    }
    return results!.length > 0 ? { found: true, results } : { found: false };
  }

  const cacheKey = `${query}:${isExactMatch}`;
  const cached = parliamentSearchCache.get(cacheKey);
  if (cached) return cached;

  const qLower = query.toLowerCase();

  if (isExactMatch) {
    const entry = parliamentByCode.get(qLower) ?? parliamentByName.get(qLower);
    if (!entry) return setCache(parliamentSearchCache, cacheKey, { found: false });
    return setCache(parliamentSearchCache, cacheKey, { found: true, state: entry.state, code: entry.code, name: entry.name, dun: entry.dun });
  }

  const results: ParliamentSearchResult['results'] = [];
  for (const entry of allParliamentEntries) {
    if (entry.name.toLowerCase().includes(qLower) || entry.code.toLowerCase().includes(qLower)) {
      results!.push({ state: entry.state, code: entry.code, name: entry.name, dun: entry.dun });
    }
  }
  if (!results!.length) return setCache(parliamentSearchCache, cacheKey, { found: false });
  return setCache(parliamentSearchCache, cacheKey, { found: true, results });
};

export const findDun = (
  query: string | string[] | null,
  isExactMatch: boolean = true
): DunSearchResult => {
  if (typeof isExactMatch !== 'boolean') isExactMatch = true;
  if (!query) return { found: false };

  if (Array.isArray(query)) {
    const results: DunSearchResult['results'] = [];
    for (const q of query) {
      const r = findDun(q, isExactMatch);
      if (r.found) {
        if (r.results) results!.push(...r.results);
        else if (r.state && r.code && r.name) results!.push({ state: r.state, parliament: r.parliament!, parliamentCode: r.parliamentCode!, code: r.code, name: r.name });
      }
    }
    return results!.length > 0 ? { found: true, results } : { found: false };
  }

  const cacheKey = `${query}:${isExactMatch}`;
  const cached = dunSearchCache.get(cacheKey);
  if (cached) return cached;

  const qLower = query.toLowerCase();

  if (isExactMatch) {
    // Try name first (unique), then code (may match multiple)
    const byName = dunByName.get(qLower);
    if (byName) return setCache(dunSearchCache, cacheKey, { found: true, ...byName });

    const byCode = dunsByCode.get(qLower);
    if (byCode && byCode.length === 1) return setCache(dunSearchCache, cacheKey, { found: true, ...byCode[0] });
    if (byCode && byCode.length > 1) return setCache(dunSearchCache, cacheKey, { found: true, results: byCode });

    return setCache(dunSearchCache, cacheKey, { found: false });
  }

  const results: DunSearchResult['results'] = [];
  for (const entry of allDunEntries) {
    if (entry.name.toLowerCase().includes(qLower) || entry.code.toLowerCase().includes(qLower)) {
      results!.push({ state: entry.state, parliament: entry.parliament, parliamentCode: entry.parliamentCode, code: entry.code, name: entry.name });
    }
  }
  if (!results!.length) return setCache(dunSearchCache, cacheKey, { found: false });
  return setCache(dunSearchCache, cacheKey, { found: true, results });
};

export const getStateByParliament = (parliament: string | null): string | null => {
  if (!parliament) return null;
  return parliamentToState.get(parliament.toLowerCase()) ?? null;
};

export const getStateByDun = (
  dun: string | null
): { state: string; parliament: string; parliamentCode: string } | null => {
  if (!dun) return null;
  const entry = dunByName.get(dun.toLowerCase());
  if (entry) return { state: entry.state, parliament: entry.parliament, parliamentCode: entry.parliamentCode };

  // Fallback: code lookup — return first match
  const byCode = dunsByCode.get(dun.toLowerCase());
  if (byCode && byCode.length > 0) return { state: byCode[0].state, parliament: byCode[0].parliament, parliamentCode: byCode[0].parliamentCode };

  return null;
};

export const getParliamentByDun = (
  dun: string | null
): { state: string; code: string; name: string; dun: Dun[] } | null => {
  if (!dun) return null;
  const entry = dunNameToParliament.get(dun.toLowerCase());
  if (entry) return { state: entry.state, code: entry.code, name: entry.name, dun: entry.dun };

  // Fallback: code lookup
  const byCode = dunsByCode.get(dun.toLowerCase());
  if (byCode && byCode.length > 0) {
    const first = byCode[0];
    const pEntry = parliamentByCode.get(first.parliamentCode.toLowerCase());
    if (pEntry) return { state: pEntry.state, code: pEntry.code, name: pEntry.name, dun: pEntry.dun };
  }

  return null;
};

export const searchAll = (query: string | null): SearchAllResult => {
  if (!query || query.trim().length === 0) {
    return { found: false, states: [], parliaments: [], duns: [] };
  }

  const cached = searchAllCache.get(query);
  if (cached) return cached;

  const qLower = query.toLowerCase().trim();
  const states: string[] = [];
  const parliaments: SearchAllResult['parliaments'] = [];
  const duns: SearchAllResult['duns'] = [];

  for (const name of allStateNames) {
    if (name.toLowerCase().includes(qLower)) states.push(name);
  }

  for (const entry of allParliamentEntries) {
    if (entry.name.toLowerCase().includes(qLower) || entry.code.toLowerCase().includes(qLower)) {
      parliaments.push({ state: entry.state, code: entry.code, name: entry.name, dun: entry.dun });
    }
  }

  for (const entry of allDunEntries) {
    if (entry.name.toLowerCase().includes(qLower) || entry.code.toLowerCase().includes(qLower)) {
      duns.push({ state: entry.state, parliament: entry.parliament, parliamentCode: entry.parliamentCode, code: entry.code, name: entry.name });
    }
  }

  const hasResults = states.length > 0 || parliaments.length > 0 || duns.length > 0;
  const result = hasResults
    ? { found: true, states, parliaments, duns }
    : { found: false, states: [], parliaments: [], duns: [] };

  return setCache(searchAllCache, query, result);
};
