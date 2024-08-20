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
        "totalAdded": 0,
        "totalModified": 0,
        "totalRemoved": 0,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            common: "value",
          },
        },
        // previous
        {
          common: {
            common: "value",
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "totalAdded": 0,
        "totalModified": 0,
        "totalRemoved": 0,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            commonUpdated: "current",
          },
        },
        // previous
        {
          common: {
            commonUpdated: "previous",
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "totalAdded": 0,
        "totalModified": 1,
        "totalRemoved": 0,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            onlyCurrent: "value",
          },
        },
        // previous
        {
          common: {},
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "totalAdded": 1,
        "totalModified": 0,
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
            onlyPrevious: "value",
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "totalAdded": 0,
        "totalModified": 0,
        "totalRemoved": 1,
      }
    `);

    expect(
      compareThemeTokensets(
        // current
        {
          common: {
            common: "value",
            commonUpdated: "current",
            onlyCurrent: "value",
          },
        },
        // previous
        {
          common: {
            common: "value",
            commonUpdated: "previous",
            onlyPrevious: "value",
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "totalAdded": 1,
        "totalModified": 1,
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
            key: "value",
          },
        },
        // previous
        {
          onlyPrevious: {
            key: "value",
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "totalAdded": 1,
        "totalModified": 0,
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
            key: "value",
          },
        },
        // previous
        {}
      )
    ).toMatchInlineSnapshot(`
      {
        "totalAdded": 1,
        "totalModified": 0,
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
            key: "current",
          },
          common2: {
            key: "current",
          },
        },
        // previous
        {
          common1: {
            key: "previous",
          },
          common2: {
            key: "previous",
          },
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "totalAdded": 0,
        "totalModified": 2,
        "totalRemoved": 0,
      }
    `);
  });
});

describe("getSemverBumpType", () => {
  test("returns `breaking` if anything removed", ({ expect }) => {
    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalModified: 0,
        totalRemoved: 1,
      })
    ).toBe("breaking");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalModified: 0,
        totalRemoved: 1,
      })
    ).toBe("breaking");

    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalModified: 1,
        totalRemoved: 1,
      })
    ).toBe("breaking");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalModified: 1,
        totalRemoved: 1,
      })
    ).toBe("breaking");
  });

  test("returns `feature` if something added and nothing removed", ({
    expect,
  }) => {
    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalModified: 0,
        totalRemoved: 0,
      })
    ).toBe("feature");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalModified: 1,
        totalRemoved: 0,
      })
    ).toBe("feature");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalModified: 0,
        totalRemoved: 1,
      })
    ).not.toBe("feature");
  });

  test("returns `fix` if something updated but nothing added or removed", ({
    expect,
  }) => {
    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalModified: 1,
        totalRemoved: 0,
      })
    ).toBe("fix");

    expect(
      getSemverBumpType({
        totalAdded: 1,
        totalModified: 1,
        totalRemoved: 0,
      })
    ).not.toBe("fix");

    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalModified: 1,
        totalRemoved: 1,
      })
    ).not.toBe("fix");
  });

  test("returns `null` if nothing changed", ({ expect }) => {
    expect(
      getSemverBumpType({
        totalAdded: 0,
        totalModified: 0,
        totalRemoved: 0,
      })
    ).toBe(null);
  });
});
