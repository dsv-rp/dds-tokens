import { describe, test } from "vitest";
import { compareThemeTokensets, getSemverBumpType } from "./compare";

describe("compareThemeTokensets", () => {
  test("comparison of the theme", ({ expect }) => {
    expect(
      compareThemeTokensets(
        // current
        {
          common: {},
        },
        // previous
        {
          common: {},
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [],
        "tokenNamesTypeChanged": [],
        "totalAdded": 0,
        "totalModified": 0,
        "totalModifiedType": 0,
        "totalModifiedValue": 0,
        "totalRemoved": 0,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            common: ["color", "value"],
          },
        },
        // previous
        {
          common: {
            common: ["color", "value"],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [],
        "tokenNamesTypeChanged": [],
        "totalAdded": 0,
        "totalModified": 0,
        "totalModifiedType": 0,
        "totalModifiedValue": 0,
        "totalRemoved": 0,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            commonUpdated: ["color", "current"],
          },
        },
        // previous
        {
          common: {
            commonUpdated: ["color", "previous"],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [],
        "tokenNamesTypeChanged": [],
        "totalAdded": 0,
        "totalModified": 1,
        "totalModifiedType": 0,
        "totalModifiedValue": 1,
        "totalRemoved": 0,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            commonTypeUpdated: ["color", "value"],
          },
        },
        // previous
        {
          common: {
            commonTypeUpdated: ["dimension", "value"],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [],
        "tokenNamesTypeChanged": [
          "commonTypeUpdated",
        ],
        "totalAdded": 0,
        "totalModified": 1,
        "totalModifiedType": 1,
        "totalModifiedValue": 0,
        "totalRemoved": 0,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            commonBothUpdated: ["color", "previous"],
          },
        },
        // previous
        {
          common: {
            commonBothUpdated: ["dimension", "current"],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [],
        "tokenNamesTypeChanged": [
          "commonBothUpdated",
        ],
        "totalAdded": 0,
        "totalModified": 1,
        "totalModifiedType": 1,
        "totalModifiedValue": 0,
        "totalRemoved": 0,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            onlyCurrent: ["color", "value"],
          },
        },
        // previous
        {
          common: {},
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [],
        "tokenNamesTypeChanged": [],
        "totalAdded": 1,
        "totalModified": 0,
        "totalModifiedType": 0,
        "totalModifiedValue": 0,
        "totalRemoved": 0,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {},
        },
        // previous
        {
          common: {
            onlyPrevious: ["color", "value"],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [
          "onlyPrevious",
        ],
        "tokenNamesTypeChanged": [],
        "totalAdded": 0,
        "totalModified": 0,
        "totalModifiedType": 0,
        "totalModifiedValue": 0,
        "totalRemoved": 1,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            common: ["color", "value"],
            commonUpdated: ["color", "current"],
            onlyCurrent: ["color", "value"],
          },
        },
        // previous
        {
          common: {
            common: ["color", "value"],
            commonUpdated: ["color", "previous"],
            onlyPrevious: ["color", "value"],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [
          "onlyPrevious",
        ],
        "tokenNamesTypeChanged": [],
        "totalAdded": 1,
        "totalModified": 1,
        "totalModifiedType": 0,
        "totalModifiedValue": 1,
        "totalRemoved": 1,
      }
    `);
  });

  test("comparison when the theme itself added or removed", ({ expect }) => {
    expect(
      compareThemeTokensets(
        // current
        {
          onlyCurrent: {
            key: ["color", "value"],
          },
        },
        // previous
        {
          onlyPrevious: {
            key: ["color", "value"],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [
          "key",
        ],
        "tokenNamesTypeChanged": [],
        "totalAdded": 1,
        "totalModified": 0,
        "totalModifiedType": 0,
        "totalModifiedValue": 0,
        "totalRemoved": 1,
      }
    `);
  });

  test("comparison when the previous one is missing", ({ expect }) => {
    expect(
      compareThemeTokensets(
        // current
        {
          onlyCurrent: {
            key: ["color", "value"],
          },
        },
        // previous
        {}
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [],
        "tokenNamesTypeChanged": [],
        "totalAdded": 1,
        "totalModified": 0,
        "totalModifiedType": 0,
        "totalModifiedValue": 0,
        "totalRemoved": 0,
      }
    `);
  });

  test("same key for different themes is counted separately", ({ expect }) => {
    expect(
      compareThemeTokensets(
        // current
        {
          common1: {
            common: ["color", "value"],
            commonUpdated: ["color", "current"],
            onlyCurrent: ["color", "value"],
          },
          common2: {
            common: ["color", "value"],
            commonUpdated: ["color", "current"],
            onlyCurrent: ["color", "value"],
          },
        },
        // previous
        {
          common1: {
            common: ["color", "value"],
            commonUpdated: ["color", "previous"],
            onlyPrevious: ["color", "value"],
          },
          common2: {
            common: ["color", "value"],
            commonUpdated: ["color", "previous"],
            onlyPrevious: ["color", "value"],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "tokenNamesRemoved": [
          "onlyPrevious",
        ],
        "tokenNamesTypeChanged": [],
        "totalAdded": 2,
        "totalModified": 2,
        "totalModifiedType": 0,
        "totalModifiedValue": 2,
        "totalRemoved": 2,
      }
    `);
  });
});

describe("getSemverBumpType", () => {
  test("returns `breaking` if anything removed", ({ expect }) => {
    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalRemoved: 1,
        totalModified: 0,
        totalModifiedType: 0,
        totalModifiedValue: 0,
      })
    ).toBe("breaking");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalRemoved: 1,
        totalModified: 0,
        totalModifiedType: 0,
        totalModifiedValue: 0,
      })
    ).toBe("breaking");

    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalRemoved: 1,
        totalModified: 1,
        totalModifiedType: 0,
        totalModifiedValue: 1,
      })
    ).toBe("breaking");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalRemoved: 1,
        totalModified: 1,
        totalModifiedType: 0,
        totalModifiedValue: 1,
      })
    ).toBe("breaking");
  });

  test("returns `breaking` if there are incompatible changes", ({ expect }) => {
    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalRemoved: 0,
        totalModified: 1,
        totalModifiedType: 1,
        totalModifiedValue: 0,
      })
    ).toBe("breaking");

    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalRemoved: 0,
        totalModified: 1,
        totalModifiedType: 0,
        totalModifiedValue: 1,
      })
    ).not.toBe("breaking");
  });

  test("returns `feature` if something added and nothing removed", ({
    expect,
  }) => {
    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalRemoved: 0,
        totalModified: 0,
        totalModifiedType: 0,
        totalModifiedValue: 0,
      })
    ).toBe("feature");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalRemoved: 0,
        totalModified: 1,
        totalModifiedType: 0,
        totalModifiedValue: 1,
      })
    ).toBe("feature");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalRemoved: 1,
        totalModified: 0,
        totalModifiedType: 0,
        totalModifiedValue: 0,
      })
    ).not.toBe("feature");
  });

  test("returns `fix` if something updated but nothing added or removed", ({
    expect,
  }) => {
    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalRemoved: 0,
        totalModified: 1,
        totalModifiedType: 0,
        totalModifiedValue: 1,
      })
    ).toBe("fix");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalRemoved: 0,
        totalModified: 1,
        totalModifiedType: 0,
        totalModifiedValue: 1,
      })
    ).not.toBe("fix");

    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalRemoved: 1,
        totalModified: 1,
        totalModifiedType: 0,
        totalModifiedValue: 1,
      })
    ).not.toBe("fix");
  });

  test("returns `null` if nothing changed", ({ expect }) => {
    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalRemoved: 0,
        totalModified: 0,
        totalModifiedType: 0,
        totalModifiedValue: 0,
      })
    ).toBe(null);
  });
});
