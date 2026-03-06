# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-03-07

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
