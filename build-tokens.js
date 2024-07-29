const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');
const { promises } = require('fs');

registerTransforms(StyleDictionary);

async function run() {
    const $themes = JSON.parse(await promises.readFile('themes/$themes.json', 'utf-8'));
    const configs = $themes.map((theme) => {
        return {
            source: Object.entries(theme.selectedTokenSets)
                .filter(([, val]) => val !== 'disabled')
                .map(([tokenset]) => `themes/${tokenset}.json`),
            platforms: {
                esm: {
                    transformGroup: 'tokens-studio',
                    buildPath: 'build/js/es/',
                    files: [
                        {
                            destination: `${theme.group}/${theme.name}/variables.js`,
                            format: 'javascript/es6'
                        },
                        {
                            format: 'typescript/es6-declarations',
                            destination: `${theme.group}/${theme.name}/variables.d.ts`
                        }
                    ]
                },
                cjs: {
                    transformGroup: 'tokens-studio',
                    buildPath: 'build/js/cjs/',
                    files: [
                        {
                            destination: `${theme.group}/${theme.name}/variables.js`,
                            format: 'javascript/module-flat'
                        },
                        {
                            format: 'typescript/es6-declarations',
                            destination: `${theme.group}/${theme.name}/variables.d.ts`
                        }
                    ]
                },
                css: {
                    transformGroup: 'tokens-studio',
                    buildPath: 'build/css/',
                    files: [
                        // Includes all tokens
                        // For general use (users use most components), storybook
                        {
                            destination: `${theme.group}/${theme.name}/variables.css`,
                            format: 'css/variables'
                        },
                        // Specific
                        // For when users want to import subsets of style
                        {
                            destination: `${theme.group}/${theme.name}/buttons.css`,
                            format: 'css/variables',
                            filter: (token) => {
                                return token.path.includes('button');
                            }
                        }
                    ]
                }
            }
        };
    });

    configs.forEach((cfg) => {
        const sd = StyleDictionary.extend(cfg);
        sd.cleanAllPlatforms();
        sd.buildAllPlatforms();
    });
}

run();
