import { readCSV } from "./utils/csv-reader";
import type { PropertyData, Region } from "./types";

export const calculateAverageRent = async (
  targetRegion: Region
): Promise<void> => {
  const results: PropertyData[] = await readCSV<PropertyData>(
    "data/technical-challenge-properties-september-2024.csv"
  );

  const filteredResults = results.filter(
    (item) => item.region.toLowerCase() === targetRegion.toLowerCase()
  );

  const totalRent = filteredResults.reduce(
    (sum, item) => sum + Number(item.monthlyRentPence),
    0
  );

  const averageRent = filteredResults.length
    ? totalRent / filteredResults.length
    : 0;

  console.log(
    `Average rental price in ${targetRegion}: £${(averageRent / 100).toFixed(
      2
    )}`
  );
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const targetRegion = args[0] as Region;

  calculateAverageRent(targetRegion);
}
