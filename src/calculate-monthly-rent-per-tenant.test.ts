import proxyquire from "proxyquire";
import { strict as assert } from "assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import sinon from "sinon";
import type { PropertyData, TenantsData } from "./types";

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
      postcode: "SW1A 1AA",
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
      postcode: "CF10 2BB",
      address: "321 Cardiff St",
      monthlyRentPence: 110000,
      region: "wales",
      capacity: 3,
      tenancyEndDate: "2025-09-30",
    },
  ] as PropertyData[]);
mockReadCSV
  .withArgs("data/technical-challenge-tenants-september-2024.csv")
  .resolves([
    { id: "1", propertyId: "1", name: "Tenant A" },
    { id: "2", propertyId: "1", name: "Tenant B" },
    { id: "3", propertyId: "2", name: "Tenant C" },
    { id: "6", propertyId: "4", name: "Tenant D" },
    { id: "7", propertyId: "4", name: "Tenant E" },
    { id: "8", propertyId: "4", name: "Tenant F" },
  ] as TenantsData[]);

const { calculateMonthlyRentPerTenant } = proxyquire(
  "./calculate-monthly-rent-per-tenant",
  {
    "./utils/csv-reader": { readCSV: mockReadCSV },
  }
);

describe("calculateMonthlyRentPerTenant", () => {
  let sandbox: sinon.SinonSandbox;
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    consoleLogStub = sandbox.stub(console, "log");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should calculate the monthly rent per tenant in pence", async () => {
    const propertyId = "1";
    const currency = "pence";

    await calculateMonthlyRentPerTenant(propertyId, currency);

    assert(consoleLogStub.calledOnce);
    assert(consoleLogStub.calledWith("Monthly rent per tenant: 50000 pence"));
  });

  it("should calculate the monthly rent per tenant in pounds", async () => {
    const propertyId = "1";
    const currency = "pounds";

    await calculateMonthlyRentPerTenant(propertyId, currency);

    assert(consoleLogStub.calledOnce);
    assert(consoleLogStub.calledWith("Monthly rent per tenant: 500 pounds"));
  });

  it("should throw an error if the property is not found", async () => {
    const propertyId = "5";
    const currency = "pence";

    await assert.rejects(
      async () => await calculateMonthlyRentPerTenant(propertyId, currency),
      new Error("Property not found")
    );
  });

  it("should throw an error if no tennat is not found", async () => {
    const propertyId = "3";
    const currency = "pence";

    await assert.rejects(
      async () => await calculateMonthlyRentPerTenant(propertyId, currency),
      new Error("No tenants found for the property")
    );
  });
});
