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
      tenancyEndDate: "2023-09-30",
    },
    {
      id: "4",
      postcode: "CF10 2BB",
      address: "321 Cardiff St",
      monthlyRentPence: 110000,
      region: "wales",
      capacity: 5,
      tenancyEndDate: "2025-09-30",
    },
  ] as PropertyData[]);
mockReadCSV
  .withArgs("data/technical-challenge-tenants-september-2024.csv")
  .resolves([
    { id: "1", propertyId: "1", name: "Tenant A" },
    { id: "2", propertyId: "1", name: "Tenant B" },
    { id: "4", propertyId: "3", name: "Tenant C" },
    { id: "5", propertyId: "3", name: "Tenant D" },
    { id: "6", propertyId: "4", name: "Tenant E" },
    { id: "7", propertyId: "4", name: "Tenant F" },
    { id: "8", propertyId: "4", name: "Tenant G" },
  ] as TenantsData[]);

const { getPropertyStatus } = proxyquire("./get-property-status", {
  "./utils/csv-reader": { readCSV: mockReadCSV },
});

describe("getPropertyStatus", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return 'PROPERTY_VACANT' if there are no tenants", async () => {
    const propertyId = "2";

    const status = await getPropertyStatus(propertyId);

    assert.strictEqual(status, "PROPERTY_VACANT");
  });

  it("should return 'PARTIALLY_VACANT' if there are fewer tenants than capacity and tenancy is active", async () => {
    const propertyId = "4";

    const status = await getPropertyStatus(propertyId);

    assert.strictEqual(status, "PARTIALLY_VACANT");
  });

  it("should return 'PROPERTY_ACTIVE' if there are tenants and tenancy is active", async () => {
    const propertyId = "1";

    const status = await getPropertyStatus(propertyId);

    assert.strictEqual(status, "PROPERTY_ACTIVE");
  });

  it("should return 'PROPERTY_OVERDUE' if there are tenants and tenancy is overdue", async () => {
    const propertyId = "3";

    const status = await getPropertyStatus(propertyId);

    assert.strictEqual(status, "PROPERTY_OVERDUE");
  });

  it("should throw an error if the property is not found", async () => {
    const propertyId = "5";

    await assert.rejects(
      async () => await getPropertyStatus(propertyId),
      new Error("Property not found")
    );
  });
});
