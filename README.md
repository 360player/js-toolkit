# ![js-toolkit-logo](https://rawgit.com/360player/js-toolkit/master/js-toolkit--small.svg) JavaScript Toolkit [![Build Status](https://img.shields.io/travis/360player/js-toolkit.svg?style=flat)](https://travis-ci.org/360player/js-toolkit) [![devDependency Status](https://david-dm.org/360player/js-toolkit/dev-status.svg)](https://david-dm.org/360player/js-toolkit#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/360player/js-toolkit/badge.svg?branch=master)](https://coveralls.io/github/360player/js-toolkit?branch=master)

### Common utility functions for modern JavaScript development.

## Installing

Install toolkit via `yarn`.
```sh
yarn add https://github.com/360player/js-toolkit.git --save
```

## Using

```javascript
import omit from 'js-toolkit/omit';
// Omits properties from payload object
let payload = omit( formData, 'password_repeat' );
```

## Development

### Linting, typechecking and testing

Code *MUST* be linted with [ESLint](https://eslint.org/), typechecked with [Flow](https://flowtype.org/) and tested with [Jest](https://facebook.github.io/jest/).
You can run each section individually via `yarn run lint`, `yarn run flow` or `yarn run test`. Or run them all in order via `yarn run code-quality`

## Contributing

- Every new feature, function or class **MUST** have specs, be fully documented and _flowtyped_.
- Every new feature, function or class **CANNOT** have any polyfills and **MUST** be ES7 compliant.
