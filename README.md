# dds-tokens

This package outputs:

-   Tokens as both `js` and `css` variables
-   Brand-specific tokens (i.e. `Daikin` and `AAF`)
-   `Light` and `Dark` mode
-   General styles as `variables.(css|js)`
-   Component-specific styles (i.e. `buttons.css`)

For a complete list of outputs, please check out the file outputs in the `build` folder.

## Usage

```
npm install @daikin-oss/dds-tokens
```

Import as js variables:

```
import {
    buttonColorBackgroundPrimaryActive
} from '@daikin-oss/dds-tokens/js/daikin/Light/variables.js';
```

Import the CSS:

```
import variables from '@daikin-oss/dds-tokens/css/daikin/Dark/variables.css'
```

The above includes all CSS classes - including core styles and components
There are also component-specific files if you don't need everything:

```
import buttonStyles from '@daikin-oss/dds-tokens/css/daikin/Dark/buttons.css'
```
