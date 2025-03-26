import { readCSV } from "../utils/csv-reader";
import { PropertyData, TenantsData } from "../types";

export const getPropertyStatus = async (
  propertyId: string
): Promise<string> => {
  const propertyData: PropertyData[] = await readCSV<PropertyData>(
    "data/technical-challenge-properties-september-2024.csv"
  );
  const tenantsData: TenantsData[] = await readCSV<TenantsData>(
    "data/technical-challenge-tenants-september-2024.csv"
  );

  const property = propertyData.find((p) => p.id === propertyId);
  if (!property) {
    throw new Error("Property not found");
  }

  const tenants = tenantsData.filter((t) => t.propertyId === propertyId);
  const tenantCount = tenants.length;
  const capacity = property.capacity;
  const tenancyEndDate = new Date(property.tenancyEndDate);
  const currentDate = new Date();

  if (tenantCount === 0) {
    return "PROPERTY_VACANT";
  }

  if (tenantCount < capacity && currentDate <= tenancyEndDate) {
    return "PARTIALLY_VACANT";
  }

  if (tenantCount > 0 && currentDate <= tenancyEndDate) {
    return "PROPERTY_ACTIVE";
  }

  if (tenantCount > 0 && currentDate > tenancyEndDate) {
    return "PROPERTY_OVERDUE";
  }

  return "UNKNOWN_STATUS";
};

// Get command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  const propertyId = args[0];

  getPropertyStatus(propertyId).then((status) => {
    console.log(`Property status: ${status}`);
  });
}
