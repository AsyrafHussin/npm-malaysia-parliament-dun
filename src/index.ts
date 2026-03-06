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

/**
 * Retrieves the list of all states.
 * @returns Array containing names of all states.
 */
export const getStates = (): string[] => {
  return allData.map(state => state.name);
};

/**
 * Gets all parliament seats for a given state.
 * @param stateName - The name of the state.
 * @returns Array of parliament objects for the selected state. Empty array if state not found.
 */
export const getParliaments = (stateName: string | null): Parliament[] => {
  if (!stateName) return [];

  const stateObj = allData.find(
    s => s.name.toLowerCase() === stateName.toLowerCase()
  );

  return stateObj ? stateObj.parliament : [];
};

/**
 * Gets all DUN seats for a given state and parliament.
 * @param stateName - The name of the state.
 * @param parliamentName - The name or code of the parliament seat.
 * @returns Array of DUN objects. Empty array if not found.
 */
export const getDuns = (
  stateName: string | null,
  parliamentName: string | null
): Dun[] => {
  if (!stateName || !parliamentName) return [];

  const stateObj = allData.find(
    s => s.name.toLowerCase() === stateName.toLowerCase()
  );
  if (!stateObj) return [];

  const parliamentObj = stateObj.parliament.find(
    p =>
      p.name.toLowerCase() === parliamentName.toLowerCase() ||
      p.code.toLowerCase() === parliamentName.toLowerCase()
  );

  return parliamentObj ? parliamentObj.dun : [];
};

/**
 * Finds parliament seat(s) by name or code.
 * @param query - The name or code to search for, or an array of queries.
 * @param isExactMatch - Exact match (true) or partial match (false). Defaults to true.
 * @returns Search result object.
 */
export const findParliament = (
  query: string | string[] | null,
  isExactMatch: boolean = true
): ParliamentSearchResult => {
  if (typeof isExactMatch !== 'boolean') isExactMatch = true;
  if (!query) return { found: false };

  if (Array.isArray(query)) {
    const allResults: ParliamentSearchResult['results'] = [];
    for (const q of query) {
      const result = findParliament(q, isExactMatch);
      if (result.found) {
        if (result.results) {
          allResults!.push(...result.results);
        } else if (result.state && result.code && result.name) {
          allResults!.push({
            state: result.state,
            code: result.code,
            name: result.name,
            dun: result.dun ?? []
          });
        }
      }
    }
    return allResults!.length > 0
      ? { found: true, results: allResults }
      : { found: false };
  }

  const results: ParliamentSearchResult['results'] = [];
  const queryLower = query.toLowerCase();

  const matcher = (value: string) =>
    isExactMatch
      ? value.toLowerCase() === queryLower
      : value.toLowerCase().includes(queryLower);

  for (const state of allData) {
    for (const p of state.parliament) {
      if (matcher(p.name) || matcher(p.code)) {
        results!.push({ state: state.name, code: p.code, name: p.name, dun: p.dun });
      }
    }
  }

  if (!results!.length) return { found: false };

  if (isExactMatch && results!.length === 1) {
    return { found: true, ...results![0] };
  }

  return { found: true, results };
};

/**
 * Finds DUN seat(s) by name or code.
 * @param query - The name or code to search for, or an array of queries.
 * @param isExactMatch - Exact match (true) or partial match (false). Defaults to true.
 * @returns Search result object.
 */
export const findDun = (
  query: string | string[] | null,
  isExactMatch: boolean = true
): DunSearchResult => {
  if (typeof isExactMatch !== 'boolean') isExactMatch = true;
  if (!query) return { found: false };

  if (Array.isArray(query)) {
    const allResults: DunSearchResult['results'] = [];
    for (const q of query) {
      const result = findDun(q, isExactMatch);
      if (result.found) {
        if (result.results) {
          allResults!.push(...result.results);
        } else if (result.state && result.code && result.name) {
          allResults!.push({
            state: result.state,
            parliament: result.parliament!,
            parliamentCode: result.parliamentCode!,
            code: result.code,
            name: result.name
          });
        }
      }
    }
    return allResults!.length > 0
      ? { found: true, results: allResults }
      : { found: false };
  }

  const results: DunSearchResult['results'] = [];
  const queryLower = query.toLowerCase();

  const matcher = (value: string) =>
    isExactMatch
      ? value.toLowerCase() === queryLower
      : value.toLowerCase().includes(queryLower);

  for (const state of allData) {
    for (const p of state.parliament) {
      for (const dun of p.dun) {
        if (matcher(dun.name) || matcher(dun.code)) {
          results!.push({
            state: state.name,
            parliament: p.name,
            parliamentCode: p.code,
            code: dun.code,
            name: dun.name
          });
        }
      }
    }
  }

  if (!results!.length) return { found: false };

  if (isExactMatch && results!.length === 1) {
    return { found: true, ...results![0] };
  }

  return { found: true, results };
};

/**
 * Gets the state that contains a given parliament code or name.
 * @param parliament - The parliament code or name.
 * @returns The state name, or null if not found.
 */
export const getStateByParliament = (parliament: string | null): string | null => {
  if (!parliament) return null;

  const parliamentLower = parliament.toLowerCase();

  for (const state of allData) {
    const found = state.parliament.find(
      p =>
        p.code.toLowerCase() === parliamentLower ||
        p.name.toLowerCase() === parliamentLower
    );
    if (found) return state.name;
  }

  return null;
};

/**
 * Gets the state and parliament that contains a given DUN code or name.
 * @param dun - The DUN code or name.
 * @returns Object with state and parliament info, or null if not found.
 */
export const getStateByDun = (
  dun: string | null
): { state: string; parliament: string; parliamentCode: string } | null => {
  if (!dun) return null;

  const dunLower = dun.toLowerCase();

  for (const state of allData) {
    for (const p of state.parliament) {
      const found = p.dun.find(
        d =>
          d.code.toLowerCase() === dunLower ||
          d.name.toLowerCase() === dunLower
      );
      if (found) {
        return {
          state: state.name,
          parliament: p.name,
          parliamentCode: p.code
        };
      }
    }
  }

  return null;
};

/**
 * Gets the parliament seat that contains a given DUN code or name.
 * @param dun - The DUN code or name.
 * @returns Parliament object with state info, or null if not found.
 */
export const getParliamentByDun = (
  dun: string | null
): { state: string; code: string; name: string; dun: Dun[] } | null => {
  if (!dun) return null;

  const dunLower = dun.toLowerCase();

  for (const state of allData) {
    for (const p of state.parliament) {
      const found = p.dun.find(
        d =>
          d.code.toLowerCase() === dunLower ||
          d.name.toLowerCase() === dunLower
      );
      if (found) {
        return { state: state.name, code: p.code, name: p.name, dun: p.dun };
      }
    }
  }

  return null;
};

/**
 * Universal search across states, parliaments, and DUNs.
 * @param query - The search query.
 * @returns Object containing matched states, parliaments, and DUNs.
 */
export const searchAll = (query: string | null): SearchAllResult => {
  if (!query || query.trim().length === 0) {
    return { found: false, states: [], parliaments: [], duns: [] };
  }

  const queryLower = query.toLowerCase().trim();
  const states: string[] = [];
  const parliaments: SearchAllResult['parliaments'] = [];
  const duns: SearchAllResult['duns'] = [];

  for (const state of allData) {
    if (state.name.toLowerCase().includes(queryLower)) {
      states.push(state.name);
    }

    for (const p of state.parliament) {
      if (
        p.name.toLowerCase().includes(queryLower) ||
        p.code.toLowerCase().includes(queryLower)
      ) {
        parliaments.push({ state: state.name, code: p.code, name: p.name, dun: p.dun });
      }

      for (const dun of p.dun) {
        if (
          dun.name.toLowerCase().includes(queryLower) ||
          dun.code.toLowerCase().includes(queryLower)
        ) {
          duns.push({
            state: state.name,
            parliament: p.name,
            parliamentCode: p.code,
            code: dun.code,
            name: dun.name
          });
        }
      }
    }
  }

  const hasResults = states.length > 0 || parliaments.length > 0 || duns.length > 0;
  if (!hasResults) return { found: false, states: [], parliaments: [], duns: [] };

  return { found: true, states, parliaments, duns };
};
