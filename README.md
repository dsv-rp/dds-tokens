# dds-tokens

This package contains:

- Tokens as JS, CSS and SCSS variables
- Brand-specific tokens (e.g. `Daikin` and `AAF`)
- `Light` and `Dark` mode for each themes
- General styles as `variables.(css|js)`
- Component-specific styles (e.g. `buttons.css`)
- SCSS mixins

For the complete list of outputs, please check out the files output in the `build` folder.

## Usage

Install package:

```sh
npm install @daikin-oss/dds-tokens
```

### Import JS variables

```js
// ESM
import { buttonColorBackgroundPrimaryActive } from "@daikin-oss/dds-tokens/js/daikin/Light/variables.js";

// CommonJS
const {
  buttonColorBackgroundPrimaryActive,
} = require("@daikin-oss/dds-tokens/js/daikin/Light/variables.js");
```

### Import CSS

```js
import variables from "@daikin-oss/dds-tokens/css/daikin/Dark/variables.css";
```

or

```css
@import url("@daikin-oss/dds-tokens/css/daikin/Dark/variables.css");
```

The above includes all CSS classes - including core styles and components.
There are also component-specific files if you don't need everything:

```js
import buttonStyles from "@daikin-oss/dds-tokens/css/daikin/Dark/buttons.css";
```

### Import SCSS mixins

SCSS mixins require the SCSS compiler, but they provide flexibility in terms of where CSS variables are deployed.

Import all themes:

```scss
@use "@daikin-oss/dds-tokens/scss/mixin" as dds-tokens;

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
@use "@daikin-oss/dds-tokens/scss/daikin/Light/mixin" as daikin-Light;
@use "@daikin-oss/dds-tokens/scss/daikin/Dark/mixin" as daikin-Dark;

:root {
  @include daikin-Light.variables;
}

:root.dark {
  @include daikin-Dark.variables;
}
```
