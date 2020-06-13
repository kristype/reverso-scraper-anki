import axios from "axios";
import JSDOM from "jsdom";
import { sleep } from "./utilities.js";

export const scrapeWords = (inputWords, delimiter) => {
  return inputWords.split(delimiter || "\n").map(async (v, i) => {
    await sleep(i * 1000);
    return lookUpWord(v.trim());
  });
};

const lookUpWord = async (inputWord) => {

  console.log(`Scraping word: ${inputWord}`);

  let result = null;
  try {
    result = await axios.get(
      `https://synonyms.reverso.net/synonyme/fr/${encodeURI(inputWord)}`
    );
  } catch (error) {
    return createResult("", inputWord, "", "", inputWord, null);
  }

  const { data } = result;

  const dom = new JSDOM.JSDOM(data);

  const synonymElements = Array.from(
    dom.window.document.querySelectorAll(".synonym.relevant")
  );

  const exampleElements = Array.from(
    dom.window.document.querySelectorAll(".phrases-examples.ltr > p > span")
  );

  const wordsElements = Array.from(
    dom.window.document.querySelectorAll(
      ".phrases-examples.ltr > p > span > em"
    )
  );

  return {
    initialWord: inputWord,
    synonymElements,
    exampleElements,
    wordsElements,
  };
};
