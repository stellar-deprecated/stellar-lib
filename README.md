#The Stellar JavaScript Library

`stellar-lib` connects to the Stellar network via the WebSocket protocol.  It runs in Node.js or in the browser.



###Use stellar-lib for:

+ Connecting to a local or remote stellard in JavaScript (Node.js or browser)
+ Issuing [stellard API](https://gostellar.org/api) requests
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


###Also see:

+ https://wiki.gostellar.org
+ https://gostellar.org

##Getting `stellar-lib`

**Via npm for Node.js**

```
  $ npm install stellar-lib
```

**Build from the source using `gulp`**

```
  $ git clone https://github.com/stellar/stellar-lib
  $ cd stellar-lib
  $ npm install
  $ gulp
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
        host:    'live.stellar.org'
      , port:    9001
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
