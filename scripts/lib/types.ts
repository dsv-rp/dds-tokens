export interface Theme {
  readonly id: string;
  readonly group: string;
  readonly name: string;
  readonly selectedTokenSets: Readonly<Record<string, "enabled" | "disabled">>;
}

export type Tokenset = Record<string, string>;

export type ThemeTokensetMap = Record<string, Tokenset>;
