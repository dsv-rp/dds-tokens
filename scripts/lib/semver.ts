export type SemverBumpType = "breaking" | "feature" | "fix";
export type SemverDigit = "major" | "minor" | "patch";

export function semverBumpTypeToDigit(
  bumpType: SemverBumpType,
  orgVersion: string
): SemverDigit {
  if (orgVersion.startsWith("0.")) {
    // rapid development
    // https://semver.org/#doesnt-this-discourage-rapid-development-and-fast-iteration
    return (
      {
        breaking: "minor",
        feature: "patch",
        fix: "patch",
      } as const
    )[bumpType];
  }

  return (
    {
      breaking: "major",
      feature: "minor",
      fix: "patch",
    } as const
  )[bumpType];
}
