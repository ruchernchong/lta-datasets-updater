import { vi } from "vitest";

const { getDistinctMakesMock } = vi.hoisted(() => ({
  getDistinctMakesMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock("@web/queries/cars", () => ({
  getDistinctMakes: getDistinctMakesMock,
}));

import { getGroupedMakes } from "./grouped-makes";

const mockMakes = (makes: string[]) =>
  getDistinctMakesMock.mockResolvedValue(makes.map((make) => ({ make })));

describe("getGroupedMakes", () => {
  beforeEach(() => {
    getDistinctMakesMock.mockReset();
  });

  it("should return sorted makes grouped by first letter", async () => {
    mockMakes([
      "123MOTORS",
      "AUDI",
      "BMW",
      "MERCEDES BENZ",
      "PORSCHE",
      "VOLKSWAGEN",
    ]);

    const result = await getGroupedMakes();

    expect(result.sortedMakes).toEqual([
      "123MOTORS",
      "AUDI",
      "BMW",
      "MERCEDES BENZ",
      "PORSCHE",
      "VOLKSWAGEN",
    ]);

    expect(result.groupedMakes).toEqual({
      "#": ["123MOTORS"],
      A: ["AUDI"],
      B: ["BMW"],
      M: ["MERCEDES BENZ"],
      P: ["PORSCHE"],
      V: ["VOLKSWAGEN"],
    });
  });

  it("should create letters array with ALL first and # last", async () => {
    mockMakes([
      "123MOTORS",
      "AUDI",
      "BMW",
      "MERCEDES BENZ",
      "PORSCHE",
      "VOLKSWAGEN",
    ]);

    const result = await getGroupedMakes();

    expect(result.letters).toEqual(["ALL", "A", "B", "M", "P", "V", "#"]);
  });

  it("should return empty when the database has no makes", async () => {
    mockMakes([]);

    const result = await getGroupedMakes();

    expect(result.sortedMakes).toEqual([]);
    expect(result.groupedMakes).toEqual({});
    expect(result.letters).toEqual(["ALL"]);
  });

  it("should handle makes starting with numbers", async () => {
    mockMakes(["3M", "7-ELEVEN", "BMW"]);

    const result = await getGroupedMakes();

    expect(result.groupedMakes["#"]).toEqual(["3M", "7-ELEVEN"]);
    expect(result.groupedMakes.B).toEqual(["BMW"]);
  });

  it("should sort # last when a number make is found after a letter make", async () => {
    mockMakes(["BMW", "3M", "AUDI"]);

    const result = await getGroupedMakes();

    expect(result.letters).toEqual(["ALL", "A", "B", "#"]);
  });

  it("should handle whitespace in make names", async () => {
    mockMakes([" AUDI ", "BMW", "  MERCEDES BENZ  "]);

    const result = await getGroupedMakes();

    expect(result.groupedMakes.A).toEqual([" AUDI "]);
    expect(result.groupedMakes.M).toEqual(["  MERCEDES BENZ  "]);
  });
});
