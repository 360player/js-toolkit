<p align="center">
	<img src="https://rawgit.com/360player/js-sdk/new-api/js-toolkit__logotype.svg" width="150" height="150" alt="360Player JavaScript SDK" />
</p>

[![Build Status][build-status-badge]][build-status-url]
[![Coverage Status][coverage-status-badge]][coverage-status-url]
[![Dependency Status][dependency-status-badge]][dependency-status-url]

# JavaScript Toolkit

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

[build-status-badge]: https://img.shields.io/travis/360player/js-sdk.svg?style=flat
[build-status-url]: https://travis-ci.org/360player/js-sdk
[coverage-status-badge]: ttps://coveralls.io/repos/github/360player/js-toolkit/badge.svg?branch=master
[coverage-status-url]: https://coveralls.io/github/360player/js-toolkit?branch=master
[dependency-status-badge]: https://david-dm.org/360player/js-sdk/dev-status.svg
[dependency-status-url]: https://david-dm.org/360player/js-sdk#info=devDependencies
