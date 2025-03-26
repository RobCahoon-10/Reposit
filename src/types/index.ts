export type PropertyData = {
  id: string;
  postcode: string;
  address: string;
  monthlyRentPence: string;
  region: string;
  capacity: number;
  tenancyEndDate: string;
};

export type TenantsData = {
  id: string;
  propertyId: string;
  name: string;
};

export type Region = "England" | "Wales" | "Scotland" | "N.Ireland";
