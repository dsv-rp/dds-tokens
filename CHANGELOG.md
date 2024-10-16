# Changelog

## 0.2.0

### Minor Changes

- **BREAKING CHANGE**: 112 token(s) removed.
  218 token(s) added.
  113 token(s) updated.

### Patch Changes

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
