## STP Frontend

# Dependencies
Latest versions of Node / NPM

```Node
v14.18.0
```
```NPM
6.14.15
```

## Installation

### Configuration

Copy the `.env` in the root of the project on the same level with `package.json`.
Replace any entries to accommodate your environment. Leaving them as they are should work if there are no port conflicts with other services on your host OS.

# Library commands list

## Build
Run `npm run build` to build the library. The build files will be stored in the `dist/` directory.

## Lint
Run `npm run lint` to lint ts,tsx,js files from the library using [eslint](https://eslint.org/).

## Run style lint
Run `npm run sass-lint` to lint the style files.
