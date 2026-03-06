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
export const allParliamentData: State[] = allData;

// ---------------------------------------------------------------------------
// Preprocessed indices — built once at module load for O(1) lookups
// ---------------------------------------------------------------------------

interface ParliamentEntry {
  state: string;
  code: string;
  name: string;
  dun: Dun[];
  // pre-lowercased for fast partial match — avoids repeated .toLowerCase() in hot loops
  codeLower: string;
  nameLower: string;
}

interface DunEntry {
  state: string;
  parliament: string;
  parliamentCode: string;
  code: string;
  name: string;
  // pre-lowercased for fast partial match and O(1) Map lookups
  codeLower: string;
  nameLower: string;
  parliamentCodeLower: string;
}

const allStateNames: string[] = [];
const allStateNamesLower: string[] = [];
const allParliamentEntries: ParliamentEntry[] = [];
const allDunEntries: DunEntry[] = [];

// O(1) maps
const stateParliamentsMap = new Map<string, Parliament[]>();    // stateLower → parliaments
const parliamentByCode = new Map<string, ParliamentEntry>();     // pCodeLower → entry
const parliamentByName = new Map<string, ParliamentEntry>();     // pNameLower → entry
const dunByName = new Map<string, DunEntry>();                   // dunNameLower → entry (names are unique)
const dunsByCode = new Map<string, DunEntry[]>();                // dunCodeLower → entries (codes repeat per state)
const parliamentToState = new Map<string, string>();             // pCode|pName lower → stateName
const dunNameToParliament = new Map<string, ParliamentEntry>();  // dunNameLower → parliament entry
const dunsByStateParliament = new Map<string, Dun[]>();          // "stateLower:pLower" → dun[] for O(1) getDuns

for (const state of allData) {
  const stateLower = state.name.toLowerCase();
  allStateNames.push(state.name);
  allStateNamesLower.push(stateLower);
  stateParliamentsMap.set(stateLower, state.parliament);

  for (const p of state.parliament) {
    const pCodeLower = p.code.toLowerCase();
    const pNameLower = p.name.toLowerCase();
    const pEntry: ParliamentEntry = { state: state.name, code: p.code, name: p.name, dun: p.dun, codeLower: pCodeLower, nameLower: pNameLower };
    allParliamentEntries.push(pEntry);

    parliamentByCode.set(pCodeLower, pEntry);
    parliamentByName.set(pNameLower, pEntry);
    parliamentToState.set(pCodeLower, state.name);
    parliamentToState.set(pNameLower, state.name);
    dunsByStateParliament.set(`${stateLower}:${pCodeLower}`, p.dun);
    dunsByStateParliament.set(`${stateLower}:${pNameLower}`, p.dun);

    for (const dun of p.dun) {
      const dunCodeLower = dun.code.toLowerCase();
      const dunNameLower = dun.name.toLowerCase();
      const dEntry: DunEntry = {
        state: state.name,
        parliament: p.name,
        parliamentCode: p.code,
        code: dun.code,
        name: dun.name,
        codeLower: dunCodeLower,
        nameLower: dunNameLower,
        parliamentCodeLower: pCodeLower
      };
      allDunEntries.push(dEntry);
      dunByName.set(dunNameLower, dEntry);
      dunNameToParliament.set(dunNameLower, pEntry);

      const existing = dunsByCode.get(dunCodeLower);
      if (existing) {
        existing.push(dEntry);
      } else {
        dunsByCode.set(dunCodeLower, [dEntry]);
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
const dunsByStateCache = new Map<string, Dun[]>();

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
  const key = `${stateName.toLowerCase()}:${parliamentName.toLowerCase()}`;
  return dunsByStateParliament.get(key) ?? [];
};

export const getDunsByState = (stateName: string | null): Dun[] => {
  if (!stateName) return [];
  const stateLower = stateName.toLowerCase();
  const cached = dunsByStateCache.get(stateLower);
  if (cached) return cached;
  const parliaments = stateParliamentsMap.get(stateLower);
  if (!parliaments) return [];
  return setCache(dunsByStateCache, stateLower, parliaments.flatMap(p => p.dun));
};

// Private single-item helper — no guard checks, no array handling, no recursion
const _findParliamentOne = (query: string, isExactMatch: boolean): ParliamentSearchResult => {
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
    if (entry.nameLower.includes(qLower) || entry.codeLower.includes(qLower)) {
      results!.push({ state: entry.state, code: entry.code, name: entry.name, dun: entry.dun });
    }
  }
  if (!results!.length) return setCache(parliamentSearchCache, cacheKey, { found: false });
  return setCache(parliamentSearchCache, cacheKey, { found: true, results });
};

export const findParliament = (
  query: string | string[] | null,
  isExactMatch: boolean = true
): ParliamentSearchResult => {
  if (typeof isExactMatch !== 'boolean') isExactMatch = true;
  if (!query) return { found: false };

  if (Array.isArray(query)) {
    const cacheKey = `[${query.join(',')}]:${isExactMatch}`;
    const cached = parliamentSearchCache.get(cacheKey);
    if (cached) return cached;
    const results: ParliamentSearchResult['results'] = [];
    for (const q of query) {
      const r = _findParliamentOne(q, isExactMatch);
      if (r.found) {
        if (r.results) results!.push(...r.results);
        else if (r.state && r.code && r.name) results!.push({ state: r.state, code: r.code, name: r.name, dun: r.dun ?? [] });
      }
    }
    return setCache(parliamentSearchCache, cacheKey, results!.length > 0 ? { found: true, results } : { found: false });
  }

  return _findParliamentOne(query, isExactMatch);
};

// Private single-item helper — no guard checks, no array handling, no recursion
const _findDunOne = (query: string, isExactMatch: boolean): DunSearchResult => {
  const cacheKey = `${query}:${isExactMatch}`;
  const cached = dunSearchCache.get(cacheKey);
  if (cached) return cached;

  const qLower = query.toLowerCase();

  if (isExactMatch) {
    const byName = dunByName.get(qLower);
    if (byName) return setCache(dunSearchCache, cacheKey, { found: true, ...byName });

    const byCode = dunsByCode.get(qLower);
    if (byCode && byCode.length === 1) return setCache(dunSearchCache, cacheKey, { found: true, ...byCode[0] });
    if (byCode && byCode.length > 1) return setCache(dunSearchCache, cacheKey, { found: true, results: byCode });

    return setCache(dunSearchCache, cacheKey, { found: false });
  }

  const results: DunSearchResult['results'] = [];
  for (const entry of allDunEntries) {
    if (entry.nameLower.includes(qLower) || entry.codeLower.includes(qLower)) {
      results!.push({ state: entry.state, parliament: entry.parliament, parliamentCode: entry.parliamentCode, code: entry.code, name: entry.name });
    }
  }
  if (!results!.length) return setCache(dunSearchCache, cacheKey, { found: false });
  return setCache(dunSearchCache, cacheKey, { found: true, results });
};

export const findDun = (
  query: string | string[] | null,
  isExactMatch: boolean = true
): DunSearchResult => {
  if (typeof isExactMatch !== 'boolean') isExactMatch = true;
  if (!query) return { found: false };

  if (Array.isArray(query)) {
    const cacheKey = `[${query.join(',')}]:${isExactMatch}`;
    const cached = dunSearchCache.get(cacheKey);
    if (cached) return cached;
    const results: DunSearchResult['results'] = [];
    for (const q of query) {
      const r = _findDunOne(q, isExactMatch);
      if (r.found) {
        if (r.results) results!.push(...r.results);
        else if (r.state && r.code && r.name) results!.push({ state: r.state, parliament: r.parliament!, parliamentCode: r.parliamentCode!, code: r.code, name: r.name });
      }
    }
    return setCache(dunSearchCache, cacheKey, results!.length > 0 ? { found: true, results } : { found: false });
  }

  return _findDunOne(query, isExactMatch);
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

  // Fallback: code lookup — use pre-lowercased parliamentCodeLower for O(1) Map lookup
  const byCode = dunsByCode.get(dun.toLowerCase());
  if (byCode && byCode.length > 0) {
    const first = byCode[0];
    const pEntry = parliamentByCode.get(first.parliamentCodeLower);
    if (pEntry) return { state: pEntry.state, code: pEntry.code, name: pEntry.name, dun: pEntry.dun };
  }

  return null;
};

export const getRandomState = (): string => {
  return allStateNames[Math.floor(Math.random() * allStateNames.length)];
};

export const getRandomParliament = (stateName?: string | null): Parliament | null => {
  if (stateName) {
    const parliaments = stateParliamentsMap.get(stateName.toLowerCase());
    if (!parliaments || parliaments.length === 0) return null;
    return parliaments[Math.floor(Math.random() * parliaments.length)];
  }
  const entry = allParliamentEntries[Math.floor(Math.random() * allParliamentEntries.length)];
  return entry ? { code: entry.code, name: entry.name, dun: entry.dun } : null;
};

export const getRandomDun = (stateName?: string | null, parliamentName?: string | null): Dun | null => {
  if (stateName && parliamentName) {
    const duns = getDuns(stateName, parliamentName);
    if (duns.length === 0) return null;
    return duns[Math.floor(Math.random() * duns.length)];
  }
  if (stateName) {
    const duns = getDunsByState(stateName);
    if (duns.length === 0) return null;
    return duns[Math.floor(Math.random() * duns.length)];
  }
  const entry = allDunEntries[Math.floor(Math.random() * allDunEntries.length)];
  return entry ? { code: entry.code, name: entry.name } : null;
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

  for (let i = 0; i < allStateNamesLower.length; i++) {
    if (allStateNamesLower[i].includes(qLower)) states.push(allStateNames[i]);
  }

  for (const entry of allParliamentEntries) {
    if (entry.nameLower.includes(qLower) || entry.codeLower.includes(qLower)) {
      parliaments.push({ state: entry.state, code: entry.code, name: entry.name, dun: entry.dun });
    }
  }

  for (const entry of allDunEntries) {
    if (entry.nameLower.includes(qLower) || entry.codeLower.includes(qLower)) {
      duns.push({ state: entry.state, parliament: entry.parliament, parliamentCode: entry.parliamentCode, code: entry.code, name: entry.name });
    }
  }

  const hasResults = states.length > 0 || parliaments.length > 0 || duns.length > 0;
  const result = hasResults
    ? { found: true, states, parliaments, duns }
    : { found: false, states: [], parliaments: [], duns: [] };

  return setCache(searchAllCache, query, result);
};
