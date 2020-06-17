import minimist from "minimist";

import { createReversoOutput, lookUpWordReverso } from "./reversoScraper.js";
import { lookUpWordWr, createWrOutput } from './wordReferenceScraper.js';
import { createResultRow, sleep } from "./utilities.js";

const { w: inputWords, d: delimiter } = minimist(process.argv.slice(2));

console.log(`Words: ${inputWords}`);
console.log(`Delimiter: ${delimiter}`);

const wordRows = inputWords.split(delimiter || "\n").map(async (word, i) => {
  await sleep(i * 3000);
  const reversoResult = await lookUpWordReverso(word.trim());
  const reversoOutput = createReversoOutput(reversoResult);
  const wrSrapeResult = await lookUpWordWr(reversoOutput.resolvedWord);
  const wrOutput = createWrOutput(wrSrapeResult);

  return createResultRow(reversoOutput, wrOutput);
});

Promise.all(wordRows).then(
  (v) => console.log(v.reduce((c, v) => c + "\n" + v)),
  (v) => console.log(v)
);
