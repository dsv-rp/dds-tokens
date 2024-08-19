export const CURRENT_PROJECT_DIR = ".";

export const PREVIOUS_PROJECT_DIR = "previous-release";

export const TOKENS_CHANGESET_FILENAME =
  ".changeset/auto-generated-token-changes.md";

/** Theme group to directory name mapping */
export const GROUP_NAME_MAP: Partial<Readonly<Record<string, string>>> = {
  DKN: "daikin",
  AAF: "aaf",
};

/** Theme name to directory name mapping */
export const THEME_NAME_MAP: Partial<Readonly<Record<string, string>>> = {
  Light: "Light",
  Dark: "Dark",
};
