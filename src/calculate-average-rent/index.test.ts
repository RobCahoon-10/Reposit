import proxyquire from "proxyquire";
import { strict as assert } from "assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import sinon from "sinon";
import { PropertyData, Region } from "../types";

const mockReadCSV = sinon.stub().resolves([
  { region: "wales", monthlyRentPence: 100000 },
  { region: "wales", monthlyRentPence: 120000 },
  { region: "england", monthlyRentPence: 90000 },
] as PropertyData[]);

const { calculateAverageRent } = proxyquire("./", {
  "../utils/csv-reader": { readCSV: mockReadCSV },
});

describe("calculateAverageRent", () => {
  let sandbox: sinon.SinonSandbox;
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    consoleLogStub = sandbox.stub(console, "log");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should calculate the average rent for the specified region", async () => {
    const targetRegion: Region = "Wales";

    await calculateAverageRent(targetRegion);

    assert(consoleLogStub.calledOnce);
    assert(
      consoleLogStub.calledWith(`Average rental price in Wales: £1100.00`)
    );
  });

  it("should handle regions with no properties", async () => {
    const targetRegion: Region = "Scotland";

    await calculateAverageRent(targetRegion);

    assert(consoleLogStub.calledOnce);
    assert(
      consoleLogStub.calledWith(`Average rental price in Scotland: £0.00`)
    );
  });
});
