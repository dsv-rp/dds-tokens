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
- Density: `Default` and `Compact` sizing, independent of brand/color scheme

> [!NOTE]
> Brand/color and density are independent axes, each split into separate files. You must import **both** a color theme file and a density file to register all the CSS variables some components rely on.

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

Density tokens (sizing for height-controlled components) are separate from the brand/color CSS files and can be imported independently, then combined with any brand/color theme:

```css
@import url("@daikin-oss/dds-tokens/css/daikin/Dark/variables.css");
@import url("@daikin-oss/dds-tokens/css/density/Compact/variables.css");
```

Available density files:

- `css/density/Default/variables.css`
- `css/density/Compact/variables.css`

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

Density mixins can be included the same way, independent of brand/color theme:

```scss
@use "pkg:@daikin-oss/dds-tokens/scss/density/Default/mixins" as density-Default;
@use "pkg:@daikin-oss/dds-tokens/scss/density/Compact/mixins" as density-Compact;

:root {
  @include density-Default.variables;
}

:root[data-density="compact"] {
  @include density-Compact.variables;
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
@import "@daikin-oss/dds-tokens/css/density/Default/variables.css";

@import "@daikin-oss/dds-tokens/tailwind4.css";
```

#### Theme-specific files

You can also use theme-specific Tailwind CSS files that include fallback values:

```css
@import "@daikin-oss/dds-tokens/css/daikin/Light/tailwind4.css";
@import "@daikin-oss/dds-tokens/css/density/Default/tailwind4.css";
```

Available files:

- `css/daikin/Light/tailwind4.css`
- `css/daikin/Dark/tailwind4.css`
- `css/aaf/Light/tailwind4.css`
- `css/aaf/Dark/tailwind4.css`
- `css/density/Default/tailwind4.css`
- `css/density/Compact/tailwind4.css`

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
import { inputHeight } from "@daikin-oss/dds-tokens/js/density/Default/variables.js";

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
- `json/density/Default/tokens.json`
- `json/density/Compact/tokens.json`

File structure: `{ "<token name>": ["<token value>", "<style-dictionary token type>", "<tokens-studio token type>" | null] }`

Example:

```json
{
  "color-blue-10": ["#ddf3fc", "color", null],
  "space-100": ["4px", "dimension", "spacing"]
}
```

Additionally, the source theme JSON files (located in `themes/`) are published in the same path within the package for advanced use cases.
