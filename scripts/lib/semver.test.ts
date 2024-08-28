import { test } from "vitest";
import { semverBumpTypeToDigit } from "./semver";

test("semverBumpTypeToDigit", ({ expect }) => {
  // normal
  expect(semverBumpTypeToDigit("breaking", "1.0.0")).toBe("major");
  expect(semverBumpTypeToDigit("feature", "1.0.0")).toBe("minor");
  expect(semverBumpTypeToDigit("fix", "1.0.0")).toBe("patch");

  // rapid development
  expect(semverBumpTypeToDigit("breaking", "0.1.0")).toBe("minor");
  expect(semverBumpTypeToDigit("feature", "0.1.0")).toBe("patch");
  expect(semverBumpTypeToDigit("fix", "0.1.0")).toBe("patch");

  // rapid development
  expect(semverBumpTypeToDigit("breaking", "0.0.0")).toBe("minor");
  expect(semverBumpTypeToDigit("feature", "0.0.0")).toBe("patch");
  expect(semverBumpTypeToDigit("fix", "0.0.0")).toBe("patch");
});
