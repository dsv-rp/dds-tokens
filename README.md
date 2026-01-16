# dds-tokens

This package provides design tokens for the Daikin Design System (DDS) in multiple formats:

- **JS/TypeScript**: ESM and CommonJS modules with TypeScript declarations
- **CSS**: CSS custom properties (CSS variables)
- **SCSS**: Sass mixins for flexible integration
- **Tailwind CSS v4**: Theme files for Tailwind CSS integration
- **JSON**: Token metadata for tooling and integrations

**Available themes:**

- Brands: `Daikin` and `AAF`
- Color schemes: `Light` and `Dark` mode for each brand

For the complete list of output files, check the `build` folder after installation.

## Usage

Install package:

```sh
npm install @daikin-oss/dds-tokens
```

### Import CSS

```js
import "@daikin-oss/dds-tokens/css/daikin/Dark/variables.css";
```

or

```css
@import url("@daikin-oss/dds-tokens/css/daikin/Dark/variables.css");
```

This imports all design tokens as CSS custom properties under the `:root` selector.

### Import SCSS mixins

SCSS mixins require the SCSS compiler, but they provide flexibility in terms of where CSS variables are deployed.

Import all themes:

```scss
@use "pkg:@daikin-oss/dds-tokens/scss/mixins" as dds-tokens;

:root {
  @include dds-tokens.daikin-Light-variables;
}

:root[data-theme="aaf"] {
  @include dds-tokens.aaf-Light-variables;
}

@media (prefers-color-scheme: dark) {
  :root {
    @include dds-tokens.daikin-Dark-variables;
  }

  :root[data-theme="aaf"] {
    @include dds-tokens.aaf-Dark-variables;
  }
}
```

Import individual themes:

```scss
@use "pkg:@daikin-oss/dds-tokens/scss/daikin/Light/mixins" as daikin-Light;
@use "pkg:@daikin-oss/dds-tokens/scss/daikin/Dark/mixins" as daikin-Dark;

:root {
  @include daikin-Light.variables;
}

:root.dark {
  @include daikin-Dark.variables;
}
```

### Tailwind CSS v4 Integration

This package provides Tailwind CSS v4 theme files that map DDS tokens to Tailwind CSS variables.

#### Common theme file (theme-agnostic)

The `tailwind4.css` file provides a theme-agnostic mapping that works with any DDS theme:

```css
@import "@daikin-oss/dds-tokens/tailwind4.css";
```

This file uses `@theme inline` and references DDS CSS variables without fallback values. You must load a DDS theme CSS file separately to provide the actual token values.

Example:

```css
@import "@daikin-oss/dds-tokens/css/daikin/Light/variables.css";
@import "@daikin-oss/dds-tokens/tailwind4.css";
```

#### Theme-specific files

You can also use theme-specific Tailwind CSS files that include fallback values:

```css
@import "@daikin-oss/dds-tokens/css/daikin/Light/tailwind4.css";
```

Available files:

- `css/daikin/Light/tailwind4.css`
- `css/daikin/Dark/tailwind4.css`
- `css/aaf/Light/tailwind4.css`
- `css/aaf/Dark/tailwind4.css`

These files use `@theme` (not inline) with fallback values, allowing them to work standalone without requiring a separate DDS theme CSS file.

#### Variable mapping

DDS tokens are mapped to Tailwind CSS variables based on their token type:

- `color` → `--color-dds-*`
- `spacing` → `--spacing-dds-*`
- `borderRadius` → `--radius-dds-*`
- `borderWidth` → `--border-width-dds-*`
- `fontSize` → `--font-size-dds-*`
- `fontWeight` → `--font-weight-dds-*`
- `fontFamily` → `--font-family-dds-*`
- `lineHeight` → `--line-height-dds-*`

Example output:

```css
/* Common file (build/tailwind4.css) */
@theme inline {
  --color-dds-color-blue-10: var(--dds-color-blue-10);
  --spacing-dds-space-100: var(--dds-space-100);
  /* ... */
}

/* Theme-specific file (build/css/daikin/Light/tailwind4.css) */
@theme {
  --color-dds-color-blue-10: var(--dds-color-blue-10, #ddf3fc);
  --spacing-dds-space-100: var(--dds-space-100, 4px);
  /* ... */
}
```

### Import JS variables

```js
// ESM
import { colorBlue10 } from "@daikin-oss/dds-tokens/js/daikin/Light/variables.js";

// CommonJS
const {
  colorBlue10,
} = require("@daikin-oss/dds-tokens/js/daikin/Light/variables.js");
```

### Use JSON files

JSON files under `json/` provide token metadata including types and values. These are primarily for internal use and tooling integrations.

Available files:

- `json/daikin/Light/tokens.json`
- `json/daikin/Dark/tokens.json`
- `json/aaf/Light/tokens.json`
- `json/aaf/Dark/tokens.json`

File structure: `{ "<token name>": ["<token value>", "<style-dictionary token type>", "<tokens-studio token type>" | null] }`

Example:

```json
{
  "color-blue-10": ["#ddf3fc", "color", null],
  "space-100": ["4px", "dimension", "spacing"]
}
```

Additionally, the source theme JSON files (located in `themes/`) are published in the same path within the package for advanced use cases.
