import { calculateAverageRent } from "./calculate-average-rent";
import { findInvalidPostcodes } from "./find-invalid-postcodes";
import { calculateMonthlyRentPerTenant } from "./calculate-monthly-rent-per-tenant";
import { getPropertyStatus } from "./get-property-status";

const main = async () => {
  try {
    await calculateAverageRent("England");
    await findInvalidPostcodes();

    const propertyId = "p_1002";
    const currency = "pounds";
    await calculateMonthlyRentPerTenant(propertyId, currency);

    const status = await getPropertyStatus(propertyId);
    console.log(`Property status: ${status}`);
  } catch (error) {
    console.error(error);
  }
};

main();
