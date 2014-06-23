#The Stellar JavaScript Library

[![Build Status](https://travis-ci.org/stellar/stellar-lib.svg?branch=develop)](https://travis-ci.org/stellar/stellar-lib) [![Coverage Status](https://coveralls.io/repos/stellar/stellar-lib/badge.png?branch=develop)](https://coveralls.io/r/stellar/stellar-lib?branch=develop)

[![NPM](https://nodei.co/npm/stellar-lib.png)](https://www.npmjs.org/package/stellar-lib)

`stellar-lib` connects to the Stellar network via the WebSocket protocol and runs in Node.js as well as in the browser.

###Use stellar-lib for:

+ Connecting to a local or remote stellard in JavaScript (Node.js or browser)
+ Issuing [stellard API](https://stellar.com/wiki/JSON_Messages) requests
+ Listening to events on the stellar network (transaction, ledger, etc.)
+ Signing and submitting transactions to the stellar network

###In this file:

1. Overview
2. [Getting `stellar-lib`](README.md#getting-stellar-lib)
3. [Quickstart](README.md#quickstart)
4. [Running tests](https://github.com/stellar/stellar-lib#running-tests)

###For additional documentation see:

1. [The `stellar-lib` Guides (docs/GUIDES.md)](docs/GUIDES.md)
2. [The `stellar-lib` API Reference (docs/REFERENCE.md)](docs/REFERENCE.md)
3. https://stellar.com/wiki/stellar_JavaScript_library

###Also see:

+ https://wiki.gostellar.org
+ https://gostellar.org

##Getting `stellar-lib`

**Via npm for Node.js**

```
  $ npm install stellar-lib
```

**Build from the source using `grunt`**

```
  $ git clone https://github.com/stellar/stellar-lib
  $ npm install
  $ grunt
```

Then use the minified `build/stellar-*-min.js` in your webpage

##Quickstart

`Remote` ([remote.js](https://github.com/stellar/stellar-lib/blob/develop/src/js/stellar/remote.js)) is the module responsible for managing connections to `stellard` servers:

```js
/* Loading stellar-lib with Node.js */
var Remote = require('stellar-lib').Remote;

/* Loading stellar-lib in a webpage */
// var Remote = stellar.Remote;

var remote = new Remote({
  // see the API Reference for available options
  trusted:        true,
  local_signing:  true,
  local_fee:      true,
  fee_cushion:     1.5,
  servers: [
    {
        host:    's1.stellar.com'
      , port:    443
      , secure:  true
    }
  ]
});

remote.connect(function() {
  /* remote connected */

  // see the API Reference for available functions
});
```

See [The `stellar-lib` Guides](docs/GUIDES.md) and [The `stellar-lib` API Reference](docs/REFERENCE.md) for walkthroughs and details about all of the available functions and options.

##Running tests

1. Clone the repository

2. `cd` into the repository and install dependencies with `npm install`

3. `npm test` or `make test` or `node_modules\.bin\mocha test\*-test.js` 

**Generating code coverage**

stellar-lib uses `istanbul` to generate code coverage. To create a code coverage report, run `npm test --coverage`. The report will be created in `coverage/lcov-report/`.
