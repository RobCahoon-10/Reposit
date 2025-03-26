import { readCSV } from "../utils/csv-reader";
import { PropertyData } from "../types";
import { isValidUKPostcode } from "../utils/is-valid-uk-postcode";

export const findInvalidPostcodes = async () => {
  const data: PropertyData[] = await readCSV<PropertyData>(
    "data/technical-challenge-properties-september-2024.csv"
  );
  const invalidPropertyIds = data
    .filter((item) => !isValidUKPostcode(item.postcode))
    .map((item) => item.id);
  console.log("Invalid Postcode for Property IDs:", invalidPropertyIds);
};

if (require.main === module) {
  findInvalidPostcodes();
}
