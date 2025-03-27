import proxyquire from "proxyquire";
import { strict as assert } from "assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import sinon from "sinon";
import type { PropertyData } from "./types";

const mockReadCSV = sinon.stub();
mockReadCSV
  .withArgs("data/technical-challenge-properties-september-2024.csv")
  .resolves([
    {
      id: "1",
      postcode: "CF10 1AA",
      address: "123 Cardiff St",
      monthlyRentPence: 100000,
      region: "wales",
      capacity: 2,
      tenancyEndDate: "2025-09-30",
    },
    {
      id: "2",
      postcode: "INVALID",
      address: "456 London Rd",
      monthlyRentPence: 90000,
      region: "england",
      capacity: 1,
      tenancyEndDate: "2025-09-30",
    },
    {
      id: "3",
      postcode: "EH1 1AA",
      address: "789 Edinburgh Ave",
      monthlyRentPence: 80000,
      region: "scotland",
      capacity: 2,
      tenancyEndDate: "2025-09-30",
    },
    {
      id: "4",
      postcode: "INVALID",
      address: "321 Cardiff St",
      monthlyRentPence: 110000,
      region: "wales",
      capacity: 3,
      tenancyEndDate: "2025-09-30",
    },
  ] as PropertyData[]);

const mockIsValidUKPostcode = sinon.stub();
mockIsValidUKPostcode.withArgs("CF10 1AA").returns(true);
mockIsValidUKPostcode.withArgs("INVALID").returns(false);
mockIsValidUKPostcode.withArgs("EH1 1AA").returns(true);

const { findInvalidPostcodes } = proxyquire("./find-invalid-postcodes", {
  "./utils/csv-reader": { readCSV: mockReadCSV },
  "./utils/is-valid-uk-postcode": { isValidUKPostcode: mockIsValidUKPostcode },
});

describe("findInvalidPostcodes", () => {
  let sandbox: sinon.SinonSandbox;
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    consoleLogStub = sandbox.stub(console, "log");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should log invalid postcode property IDs", async () => {
    await findInvalidPostcodes();

    assert(consoleLogStub.calledOnce);
    assert(
      consoleLogStub.calledWith("Invalid Postcode for Property IDs:", [
        "2",
        "4",
      ])
    );
  });
});
