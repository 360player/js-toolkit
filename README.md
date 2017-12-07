# ![js-toolkit-logo](https://cdn.rawgit.com/360player/js-toolkit/46ecb33b/js-toolkit--small.svg) JavaScript Toolkit
[![Build Status](https://img.shields.io/travis/360player/js-toolkit.svg?style=flat)](https://travis-ci.org/360player/js-toolkit) [![devDependency Status](https://david-dm.org/360player/js-toolkit/dev-status.svg)](https://david-dm.org/360player/js-toolkit#info=devDependencies)

### Common utility functions for modern JavaScript development.

This toolkit contains fully Flow-typed, _untranspiled_ packages.

## Installing

Install toolkit via `yarn`.
```sh
yarn add https://github.com/360player/js-toolkit.git --save
```

## Using

Since this project isn't a traditional "_node module_" and uncompiled, you have to resolve paths (_recommended_), or include directly from `node_modules`.

You decide yourself how to build and/or bundle your application, something that is outside `js-toolkit`'s scope.

## Development

### Linting, typechecking and testing

Code *MUST* be linted with [ESLint](https://eslint.org/), typechecked with [Flow](https://flowtype.org/) and tested with [Jest](https://facebook.github.io/jest/).
You can run each section individually via `yarn run lint`, `yarn run flow` or `yarn run test`. Or run them all in order via `yarn run code-quality`

### Philosophy

`js-toolkit` applies a "Pure ES7, No Polyfill" (PENP) approach to it's code.

## Contributing

- Every new feature, function or class **MUST** have specs, be fully documented and _flowtyped_.
- Every new feature, function or class **CANNOT** have any polyfills and **MUST** be ES7 compliant.
