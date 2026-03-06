# Malaysia Parliament DUN

A Comprehensive NPM Package of Malaysia Parliament (Parlimen) and State Assembly (DUN) Constituencies, based on GE15 2022, available in JSON format.

[![Version](https://img.shields.io/npm/v/malaysia-parliament-dun.svg)](https://npmjs.org/package/malaysia-parliament-dun)
[![Downloads/week](https://img.shields.io/npm/dw/malaysia-parliament-dun.svg)](https://npmjs.org/package/malaysia-parliament-dun)
[![NPM monthly downloads](https://img.shields.io/npm/dm/malaysia-parliament-dun.svg?style=flat)](https://www.npmjs.com/package/malaysia-parliament-dun)
[![NPM total downloads](https://img.shields.io/npm/dt/malaysia-parliament-dun.svg?style=flat)](https://www.npmjs.com/package/malaysia-parliament-dun)
[![License](https://img.shields.io/npm/l/malaysia-parliament-dun.svg)](https://github.com/AsyrafHussin/npm-malaysia-parliament-dun/blob/main/package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub Workflow Status](https://github.com/AsyrafHussin/npm-malaysia-parliament-dun/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/AsyrafHussin/npm-malaysia-parliament-dun/actions)

## Overview

`malaysia-parliament-dun` is an npm package that provides a complete list of Malaysia's Parliament (Parlimen) and State Legislative Assembly (DUN - Dewan Undangan Negeri) constituencies, based on the 15th General Election (GE15) 2022. It covers all 13 states and 3 federal territories, with 222 parliament seats and 600 DUN seats.

## Table of Contents

- [Installation](#installation)
  - [NPM](#npm)
  - [Yarn](#yarn)
  - [CDN via jsDelivr](#cdn-via-jsdelivr)
- [Imports](#imports)
  - [ES Modules (Recommended)](#es-modules-recommended)
  - [CommonJS](#commonjs)
  - [Script Tag](#script-tag)
    - [Destructuring](#destructuring)
    - [Direct Access](#direct-access)
- [Usage](#usage)
  - [getStates](#getstates)
  - [getParliaments](#getparliaments)
  - [getDuns](#getduns)
  - [findParliament](#findparliament)
  - [findDun](#finddun)
  - [getStateByParliament](#getstatebyparliament)
  - [getStateByDun](#getstatebydun)
  - [getParliamentByDun](#getparliamentbydun)
  - [searchAll](#searchall)
- [TypeScript Support](#typescript-support)
- [Testing](#testing)
  - [Running the Tests](#running-the-tests)
  - [Watch Mode](#watch-mode)
  - [Test Coverage](#test-coverage)
- [Data Source](#data-source)
- [Contributing](#contributing)
- [License](#license)

## Installation

### NPM

```bash
npm i malaysia-parliament-dun
```

### Yarn

```bash
yarn add malaysia-parliament-dun
```

### CDN via jsDelivr

```html
<!-- Regular version -->
<script src="https://cdn.jsdelivr.net/npm/malaysia-parliament-dun@1.0.0/dist/malaysia-parliament-dun.js"></script>

<!-- Minified version -->
<script src="https://cdn.jsdelivr.net/npm/malaysia-parliament-dun@1.0.0/dist/malaysia-parliament-dun.min.js"></script>
```

## Imports

### ES Modules (Recommended)

For modern JavaScript environments with ES module support:

```js
import {
  getStates,
  getParliaments,
  getDuns,
  findParliament,
  findDun,
  getStateByParliament,
  getStateByDun,
  getParliamentByDun,
  searchAll,
} from "malaysia-parliament-dun";
```

### CommonJS

For Node.js environments or legacy applications:

```js
const {
  getStates,
  getParliaments,
  getDuns,
  findParliament,
  findDun,
  getStateByParliament,
  getStateByDun,
  getParliamentByDun,
  searchAll,
} = require("malaysia-parliament-dun");
```

### Script Tag

Once you've included the library via the script tag, you can access its functions in two ways:

#### Destructuring

You can destructure the desired functions from `window.malaysiaParliamentDun`:

```js
const {
  getStates,
  getParliaments,
  getDuns,
  findParliament,
  findDun,
  getStateByParliament,
  getStateByDun,
  getParliamentByDun,
  searchAll,
} = window.malaysiaParliamentDun;
```

#### Direct Access

Alternatively, you can call the functions directly using the `malaysiaParliamentDun` object:

```js
const states = window.malaysiaParliamentDun.getStates();
const parliaments = window.malaysiaParliamentDun.getParliaments("Kelantan");
const duns = window.malaysiaParliamentDun.getDuns("Kelantan", "Rantau Panjang");
const parliament = window.malaysiaParliamentDun.findParliament("Rantau Panjang");
const dun = window.malaysiaParliamentDun.findDun("Apam Putra");
const state = window.malaysiaParliamentDun.getStateByParliament("P023");
const stateByDun = window.malaysiaParliamentDun.getStateByDun("Apam Putra");
const parliamentByDun = window.malaysiaParliamentDun.getParliamentByDun("Apam Putra");
const results = window.malaysiaParliamentDun.searchAll("Kelantan");
```

## Usage

### getStates

Returns an array of all state names.

Example usage:

```js
const states = getStates();
```

Example result:

```js
[
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Wp Kuala Lumpur",
  "Wp Labuan",
  "Wp Putrajaya",
]
```

### getParliaments

Returns all parliament seats for a given state.

**Parameters:**

- `stateName` (string): The name of the state.

Example usage:

```js
const parliaments = getParliaments("Kelantan");
```

Example result:

```js
[
  {
    "code": "P019",
    "name": "Tumpat",
    "dun": [
      { "code": "N01", "name": "Salor" },
      { "code": "N02", "name": "Chetok" },
      { "code": "N03", "name": "Pangkalan Kubor" },
      { "code": "N04", "name": "Pengkalan Pasir" }
    ]
  },
  ...
]
```

### getDuns

Returns all DUN seats for a given state and parliament.

**Parameters:**

- `stateName` (string): The name of the state.
- `parliamentName` (string): The name or code of the parliament seat.

Example usage:

```js
const duns = getDuns("Kelantan", "Rantau Panjang");

// Also works with parliament code
const dunsByCode = getDuns("Kelantan", "P023");
```

Example result:

```js
[
  { "code": "N14", "name": "Bukit Tuku" },
  { "code": "N15", "name": "Gual Periok" },
  { "code": "N16", "name": "Apam Putra" }
]
```

### findParliament

Finds parliament seat(s) by name or code. Supports exact match, partial match, and batch processing.

**Parameters:**

- `query` (string | string[]): The parliament name or code to search for. Can be a single string or an array of strings.
- `isExactMatch` (boolean, optional): If `true` (default), performs exact match. If `false`, performs partial match.

Example usage:

```js
// Exact search by name
const result = findParliament("Rantau Panjang");

// Exact search by code
const byCode = findParliament("P023");

// Partial search
const partial = findParliament("Rantau", false);

// Batch processing
const batch = findParliament(["Rantau Panjang", "Tumpat"]);
```

Example result for exact search:

```js
{
  "found": true,
  "state": "Kelantan",
  "code": "P023",
  "name": "Rantau Panjang",
  "dun": [
    { "code": "N14", "name": "Bukit Tuku" },
    { "code": "N15", "name": "Gual Periok" },
    { "code": "N16", "name": "Apam Putra" }
  ]
}
```

Example result for partial search:

```js
{
  "found": true,
  "results": [
    {
      "state": "Kelantan",
      "code": "P023",
      "name": "Rantau Panjang",
      "dun": [...]
    },
    {
      "state": "Negeri Sembilan",
      "code": "P124",
      "name": "Rembau",
      "dun": [...]
    },
    ...
  ]
}
```

Example result for batch processing:

```js
{
  "found": true,
  "results": [
    {
      "state": "Kelantan",
      "code": "P023",
      "name": "Rantau Panjang",
      "dun": [...]
    },
    {
      "state": "Kelantan",
      "code": "P019",
      "name": "Tumpat",
      "dun": [...]
    }
  ]
}
```

Example result if not found:

```js
{
  "found": false
}
```

### findDun

Finds DUN seat(s) by name or code. Supports exact match, partial match, and batch processing.

**Parameters:**

- `query` (string | string[]): The DUN name or code to search for. Can be a single string or an array of strings.
- `isExactMatch` (boolean, optional): If `true` (default), performs exact match. If `false`, performs partial match.

Example usage:

```js
// Exact search by name
const result = findDun("Apam Putra");

// Partial search
const partial = findDun("Kota", false);

// Batch processing
const batch = findDun(["Apam Putra", "Gual Periok"]);
```

Example result for exact search:

```js
{
  "found": true,
  "state": "Kelantan",
  "parliament": "Rantau Panjang",
  "parliamentCode": "P023",
  "code": "N16",
  "name": "Apam Putra"
}
```

Example result for partial search:

```js
{
  "found": true,
  "results": [
    {
      "state": "Johor",
      "parliament": "Kota Tinggi",
      "parliamentCode": "P158",
      "code": "N41",
      "name": "Kota Tinggi"
    },
    {
      "state": "Sabah",
      "parliament": "Kota Belud",
      "parliamentCode": "P171",
      "code": "N02",
      "name": "Tempasuk"
    },
    ...
  ]
}
```

Example result if not found:

```js
{
  "found": false
}
```

### getStateByParliament

Returns the state name for a given parliament code or name.

**Parameters:**

- `parliament` (string): The parliament code (e.g. `"P023"`) or name (e.g. `"Rantau Panjang"`).

Example usage:

```js
// By parliament code
const state = getStateByParliament("P023");

// By parliament name
const stateByName = getStateByParliament("Rantau Panjang");
```

Example result:

```js
"Kelantan"
```

Returns `null` if not found:

```js
getStateByParliament("InvalidParliament"); // null
```

### getStateByDun

Returns the state, parliament name, and parliament code for a given DUN name.

**Parameters:**

- `dun` (string): The DUN name to search for.

Example usage:

```js
const result = getStateByDun("Apam Putra");
```

Example result:

```js
{
  "state": "Kelantan",
  "parliament": "Rantau Panjang",
  "parliamentCode": "P023"
}
```

Returns `null` if not found:

```js
getStateByDun("InvalidDun"); // null
```

### getParliamentByDun

Returns the parliament seat details that contains a given DUN name.

**Parameters:**

- `dun` (string): The DUN name to search for.

Example usage:

```js
const result = getParliamentByDun("Apam Putra");
```

Example result:

```js
{
  "state": "Kelantan",
  "code": "P023",
  "name": "Rantau Panjang",
  "dun": [
    { "code": "N14", "name": "Bukit Tuku" },
    { "code": "N15", "name": "Gual Periok" },
    { "code": "N16", "name": "Apam Putra" }
  ]
}
```

Returns `null` if not found:

```js
getParliamentByDun("InvalidDun"); // null
```

### searchAll

Universal search function that searches across states, parliaments, and DUNs in a single query. Supports partial matching.

**Parameters:**

- `query` (string): The search query to match against states, parliament names/codes, and DUN names/codes.

**What it searches:**

- **States**: Searches state names for partial matches
- **Parliaments**: Searches parliament names and codes for partial matches
- **DUNs**: Searches DUN names and codes for partial matches

Example usage:

```js
// Search for a state
const stateSearch = searchAll("Kelantan");

// Search for parliaments with partial name
const parliamentSearch = searchAll("Rantau");

// Search for DUNs with partial name
const dunSearch = searchAll("Apam");

// Search by parliament code
const codeSearch = searchAll("P023");
```

#### Example 1: Searching for a state name

```js
searchAll("Kelantan")
```

Result:

```js
{
  "found": true,
  "states": ["Kelantan"],
  "parliaments": [],
  "duns": []
}
```

#### Example 2: Searching for parliaments with partial term

```js
searchAll("Rantau")
```

Result:

```js
{
  "found": true,
  "states": [],
  "parliaments": [
    {
      "state": "Kelantan",
      "code": "P023",
      "name": "Rantau Panjang",
      "dun": [...]
    }
  ],
  "duns": []
}
```

#### Example 3: Searching for DUNs with partial term

```js
searchAll("Apam")
```

Result:

```js
{
  "found": true,
  "states": [],
  "parliaments": [],
  "duns": [
    {
      "state": "Kelantan",
      "parliament": "Rantau Panjang",
      "parliamentCode": "P023",
      "code": "N16",
      "name": "Apam Putra"
    }
  ]
}
```

#### Example 4: Searching by parliament code

```js
searchAll("P023")
```

Result:

```js
{
  "found": true,
  "states": [],
  "parliaments": [
    {
      "state": "Kelantan",
      "code": "P023",
      "name": "Rantau Panjang",
      "dun": [...]
    }
  ],
  "duns": []
}
```

#### Example 5: No matches found

```js
searchAll("XYZNoMatch")
```

Result:

```js
{
  "found": false,
  "states": [],
  "parliaments": [],
  "duns": []
}
```

**Use Cases:**

- **Search bars**: One search covers states, parliaments, and DUNs
- **Auto-complete**: Get suggestions across all constituency types
- **Data validation**: Check if input exists anywhere in Malaysia's electoral data
- **Flexible lookup**: No need to know if user is searching for a state, parliament, or DUN

## TypeScript Support

`malaysia-parliament-dun` provides TypeScript type declarations out-of-the-box. All exported functions and interfaces are fully typed.

Available interfaces:

```ts
import type {
  Dun,
  Parliament,
  State,
  ParliamentSearchResult,
  DunSearchResult,
  SearchAllResult,
} from "malaysia-parliament-dun";
```

## Testing

The library is equipped with unit tests to ensure its functionality and reliability. We utilize the Jest testing framework for this purpose.

### Running the Tests

1. Ensure you have all dependencies installed:

```bash
npm ci
```

2. Run the test command:

```bash
npm test
```

### Watch Mode

For active development, you can run tests in watch mode:

```bash
npm run test:watch
```

### Test Coverage

```bash
npm run test:coverage
```

Note: The `coverage` directory is not included in the repository as it is generated on-the-fly whenever tests are run with coverage.

## Data Source

This package is built on the data from the [Malaysia Parliament DUN GitHub repository](https://github.com/AsyrafHussin/malaysia-parliament-dun). It is closely associated with and relies on the JSON data available in this repository. For the most up-to-date constituency information, refer to the original repository.

## Contributing

If you find any inaccuracies, typos, or missing data, we welcome contributions! Please feel free to open an issue or submit a pull request.

## License

This repository is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.
