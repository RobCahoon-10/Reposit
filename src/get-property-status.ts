import { readCSV } from "./utils/csv-reader";
import type { PropertyData, TenantsData } from "./types";

export const getPropertyStatus = async (
  propertyId: string
): Promise<string> => {
  const propertyData = await readCSV<PropertyData>(
    "data/technical-challenge-properties-september-2024.csv"
  );
  const tenantsData = await readCSV<TenantsData>(
    "data/technical-challenge-tenants-september-2024.csv"
  );

  const selectedProperty = findPropertyById(propertyData, propertyId);
  if (!selectedProperty) {
    throw new Error("Property not found");
  }

  const tenantsInProperty = findTenantsByPropertyId(tenantsData, propertyId);

  return determinePropertyStatus(selectedProperty, tenantsInProperty);
};

const findPropertyById = (
  propertyData: PropertyData[],
  propertyId: string
): PropertyData | undefined => {
  return propertyData.find((property) => property.id === propertyId);
};

const findTenantsByPropertyId = (
  tenantsData: TenantsData[],
  propertyId: string
): TenantsData[] => {
  return tenantsData.filter((tenants) => tenants.propertyId === propertyId);
};

const determinePropertyStatus = (
  property: PropertyData,
  tenants: TenantsData[]
): string => {
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

if (require.main === module) {
  const args = process.argv.slice(2);
  const propertyId = args[0];

  getPropertyStatus(propertyId).then((status) => {
    console.log(`Property status: ${status}`);
  });
}
