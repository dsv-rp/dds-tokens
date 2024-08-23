---
"@daikin-oss/dds-tokens": patch
---

Add SCSS build and JSON source to the package.
The `.js` extension is now optional when importing JS files.
The directory structure of the build results has been changed so that ESM and CJS are generated in the same directory.
There is no difference in the import method, except that the `.js` extension can now be omitted, as we define subpath exports.
