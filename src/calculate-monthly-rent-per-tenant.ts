import { readCSV } from "./utils/csv-reader";
import type { PropertyData, TenantsData } from "./types";

export const calculateMonthlyRentPerTenant = async (
  propertyId: string,
  currency: "pence" | "pounds"
) => {
  const propertyData: PropertyData[] = await readCSV<PropertyData>(
    "data/technical-challenge-properties-september-2024.csv"
  );
  const tenantsData: TenantsData[] = await readCSV<TenantsData>(
    "data/technical-challenge-tenants-september-2024.csv"
  );

  const selectedProperty = propertyData.find(
    (property) => property.id === propertyId
  );
  if (!selectedProperty) {
    throw new Error("Property not found");
  }

  const tenantsInProperty = tenantsData.filter(
    (tenants) => tenants.propertyId === propertyId
  );
  if (tenantsInProperty.length === 0) {
    throw new Error("No tenants found for the property");
  }

  const totalMonthlyRentPence = Number(selectedProperty.monthlyRentPence);

  const monthlyRentPerTenantPence =
    totalMonthlyRentPence / tenantsInProperty.length;

  let rentPerTenant;
  if (currency === "pounds") {
    rentPerTenant = monthlyRentPerTenantPence / 100;
  } else {
    rentPerTenant = monthlyRentPerTenantPence;
  }

  console.log(`Monthly rent per tenant: ${rentPerTenant} ${currency}`);
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const propertyId = args[0];
  const currency = args[1] as "pence" | "pounds";

  calculateMonthlyRentPerTenant(propertyId, currency);
}
