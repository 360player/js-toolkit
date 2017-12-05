# JavaScript Toolkit

### Common utility functions for modern JavaScript development.

This toolkit contains fully Flow-typed, _untranspiled_ packages.

## Installing

Install toolkit via `yarn`.
```sh
yarn add https://github.com/360player/js-toolkit.git --save
```

## Using

Since this project isn't a traditional "_node module_" and uncompiled, you have to resolve paths (_recommended_), or include directly from `node_modules`.

## Development

### Linting, typechecking and testing

Code *MUST* be linted with [ESLint](https://eslint.org/), typechecked with [Flow](https://flowtype.org/) and tested with [Jest](https://facebook.github.io/jest/).
You can run each section individually via `yarn run lint`, `yarn run flow` or `yarn run test`. Or run them all in order via `yarn run code-quality`

## Contributing

- Every new feature, function or class **MUST** have specs, be fully documented and _flowtyped_.
- Every new feature, function or class **CANNOT** have any polyfills and **MUST** be ES6 compliant.
