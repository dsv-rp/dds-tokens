/**
 * Indicates the type of changes.
 * Note that due to rapid development, this does not immediately correspond to the digits of semver.
 */
export type SemverBumpType = "breaking" | "feature" | "fix";

/**
 * The semver digit.
 * Always `major.minor.patch`.
 */
export type SemverDigit = "major" | "minor" | "patch";

/**
 * Converts the type of changes to the semver digit to bump.
 * @param bumpType The type of changes
 * @param orgVersion The version to bump. Used for determining rapid development.
 * @returns The semver digit to bump.
 */
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
