import minimist from "minimist";

import { scrapeWords } from "./scraper.js";
import { createResultRow } from "./utilities.js";

const { w: inputWords, d: delimiter } = minimist(process.argv.slice(2));

console.log(`Words: ${inputWords}`);
console.log(`Delimiter: ${delimiter}`);

const wordRows = scrapeWords(inputWords, delimiter).map(async (p) => {
  const scrapeResult = await p;
  return createResultRow(scrapeResult);
});

Promise.all(wordRows).then(
  (v) => console.log(v.reduce((c, v) => c + "\n" + v)),
  (v) => console.log(v)
);
