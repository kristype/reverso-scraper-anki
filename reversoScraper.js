import axios from "axios";
import JSDOM from "jsdom";

export const lookUpWordReverso = async (inputWord) => {
  console.log(`Scraping word: ${inputWord}`);

  let result = null;
  try {
    result = await axios.get(
      `https://synonyms.reverso.net/synonyme/fr/${encodeURI(inputWord)}`
    );
  } catch (error) {
    return createResult(inputWord);
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

  return createResult(
    inputWord,
    synonymElements,
    exampleElements,
    wordsElements
  );
};

export const createReversoOutput = (scrapeResult) => {
  const {
    initialWord,
    exampleElements,
    wordsElements,
    synonymElements,
  } = scrapeResult;

  const resolvedWord =
    wordsElements.length > 0 ? wordsElements[0].textContent : initialWord;

  const examplesSorted = getExaplesSorted(exampleElements);

  const example = examplesSorted.length > 0 ? examplesSorted[0] : null;
  const example2 = examplesSorted.length > 1 ? examplesSorted[1] : null;

  const indexOfWord = example?.indexOf(resolvedWord) || null;

  const synonyms = getSynonyms(synonymElements);
  const exampleStart = example?.slice(0, indexOfWord).trim() || null;
  const exampleEnd =
    example?.slice(indexOfWord + resolvedWord.length, example.length).trim() ||
    null;

  return {
    initialWord,
    exampleStart,
    resolvedWord,
    exampleEnd,
    synonyms,
    example2,
    isSameAsInitial: initialWord.toLowerCase() == resolvedWord.toLowerCase(),
  };
};
function createResult(
  inputWord,
  synonymElements,
  exampleElements,
  wordsElements
) {
  return {
    initialWord: inputWord,
    synonymElements: synonymElements || [],
    exampleElements: exampleElements || [],
    wordsElements: wordsElements || [],
  };
}

function getSynonyms(synonymElements) {
  return synonymElements.length > 0
    ? synonymElements
        .slice(0, 10)
        .map((v) => v.text)
        .reduce((c, v) => c + ", " + v)
    : "";
}

function getExaplesSorted(examples) {
  return examples.length > 0
    ? examples.map((v) => v.textContent).sort((a, b) => a.length - b.length)
    : [];
}
