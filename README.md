# hbslint-airhelp
npm package with AirHelp Handlebars Lint shareable cli and config

## Usage
This package provides cli to lint your project against config. It also provides config used in AirHelp Ember applications.

### cli
To run linter in your build environment, create npm script that runs provided `hbslint` cli against your project source.

1. `hbslint app/templates app/components`
2. Use `verbose` option to check errors `hbslint templates --verbose -v`
3. Use `config` option to provide custom rules configuration `hbslint templates --config config/myconfig.js`

## Contribution
Please introduce changes in separate PRs.

This package is using [simple-git-changelog](https://github.com/ianhenderson/simple-git-changelog) for creating changelog. Please use following prefixes for all commits that are supposed to be part of changelog:
* `changelog`
* `fix`
* `docs`
* `chore`
* `feat`
* `feature`
* `refactor`
* `update`

for example:
```
git commit -m "fix: lorem ispum dolor"
```
