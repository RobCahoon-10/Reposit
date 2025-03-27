import fs from "fs";
import { parse } from "csv-parse";

export const readCSV = async <T>(filePath: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true }))
      .on("data", (data: T) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error: any) => reject(error));
  });
};
