# Changelog

## 0.3.2

### Patch Changes

- 2 token(s) added.

## 0.3.1

### Patch Changes

- [#43](https://github.com/dsv-rp/dds-tokens/pull/43) [`f337cef`](https://github.com/dsv-rp/dds-tokens/commit/f337ceffd68b769f50bba793d3ce010a50b09ab9) Thanks [@yodas7](https://github.com/yodas7)! - Add Tokens Studio type to the tokens in the JSON outputs.

## 0.3.0

### Minor Changes

- **BREAKING CHANGE**: 378 token(s) removed (`button-color-background-primary-active`, `checkbox-border-unselected`, `color-text-default`, `line-height-tight`, `regular-tight-350` and more).
  **BREAKING CHANGE**: 24 token(s) updated with incompatible changes (`font-family-base`, `font-size-300`, `font-size-350`, `font-size-400`, `font-weight-bold` and more).
  56 token(s) added.
  4 token(s) updated.

## 0.2.1

### Patch Changes

- 99 token(s) added.
  44 token(s) updated.

## 0.2.0

### Minor Changes

- **BREAKING CHANGE**: 604 token(s) removed (`body-2-xl`, `border-width-s`, `color-magenta-110`, `font-size-s`, `space-2` and more).
  **BREAKING CHANGE**: 12 token(s) updated with incompatible changes (`font-family-base`, `font-family-base`, `font-weight-bold`).
  315 token(s) added.
  349 token(s) updated.

### Patch Changes

- [#32](https://github.com/dsv-rp/dds-tokens/pull/32) [`bed4855`](https://github.com/dsv-rp/dds-tokens/commit/bed4855045a60df8c448c1024f991d69377e8c8f) Thanks [@yodas7](https://github.com/yodas7)! - Add JSON builds. (DDS-1513)
  Add type definitions for CJS files.

- [#25](https://github.com/dsv-rp/dds-tokens/pull/25) [`b0f7c73`](https://github.com/dsv-rp/dds-tokens/commit/b0f7c73f4214e8480af395c21ae59ef8752d676f) Thanks [@yodas7](https://github.com/yodas7)! - Add SCSS build and JSON source to the package.
  The `.js` extension is now optional when importing JS files.
  The directory structure of the build results has been changed so that ESM and CJS are generated in the same directory.
  There is no difference in the import method, except that the `.js` extension can now be omitted, as we define subpath exports.

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-07-29

### Added

- DDS-1227 Add CJS output to build
- Design Token Changes DDS-873/874/980

## [0.0.0] - Initial Commit

### Added

- Initial support for design tokens in both CSS and JS formats for Daikin and AAF brands.
