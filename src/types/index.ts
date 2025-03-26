export type PropertyData = {
  id: string;
  postcode: string;
  address: string;
  monthlyRentPence: number;
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
