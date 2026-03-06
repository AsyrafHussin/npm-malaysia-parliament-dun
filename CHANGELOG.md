# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-03-07

### Added

- `allParliamentData` export alias for `allData` — more descriptive name

### Improved

- `getDunsByState` — results are now cached for repeated calls
- `findParliament` / `findDun` — batch array queries are now cached
- `searchAll` — state name matching uses pre-lowercased array, eliminates `toLowerCase()` per iteration
- Eliminated recursion in `findParliament` and `findDun` — extracted private single-item helpers to avoid redundant guard/cache checks on each array item

## [1.1.1] - 2026-03-07

### Fixed

- Include `dist/` files in npm publish (workflow was missing `npm run build` step)
- Auto-update CDN links in README on each release

## [1.1.0] - 2026-03-07

### Added

- `getDunsByState(stateName)` — get all DUN seats across all parliaments for a given state
- `getRandomState()` — returns a random state name
- `getRandomParliament(stateName?)` — returns a random parliament seat, optionally filtered by state
- `getRandomDun(stateName?, parliamentName?)` — returns a random DUN seat, optionally filtered by state and/or parliament

### Fixed

- Normalized `repository.url` in `package.json` to `git+https://...` format

### CI

- Added `ci.yml` workflow to auto-run tests on every push to `main` and every PR across Node 18, 20 and 22

## [1.0.0] - 2026-03-07

### Added

- Initial release with GE15 (PRU-15) 2022 data
- 222 Parliament seats and 600 DUN seats across 16 states and federal territories
- Core functions: `getStates`, `getParliaments`, `getDuns`
- Search functions: `findParliament`, `findDun`, `searchAll`
- Lookup helpers: `getStateByParliament`, `getStateByDun`, `getParliamentByDun`
- Full TypeScript support with exported interfaces (`State`, `Parliament`, `Dun`, `ParliamentSearchResult`, `DunSearchResult`, `SearchAllResult`)
- ESM, CJS and IIFE builds via tsup
- 55 unit tests with Jest
- GitHub Actions workflow for automated npm publish on release
- README with full usage documentation

### Performance

- Preprocessed Maps and Sets built at module load for O(1) exact lookups (`parliamentByCode`, `parliamentByName`, `dunByName`, `dunsByCode`, `dunsByStateParliament`)
- Pre-lowercased keys stored in entries to eliminate runtime `toLowerCase()` in hot loops
- Result caching for `findParliament`, `findDun`, and `searchAll`
- Minified `data.json` (72KB → 30KB)
