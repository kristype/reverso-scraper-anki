export const sleep = (m) => new Promise((r) => setTimeout(r, m));

export const createResultRow = (scrapeResult) => {
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
  const exampleStart = example?.slice(0, indexOfWord).trim() || "";
  const exampleEnd =
    example?.slice(indexOfWord + resolvedWord.length, example.length).trim() ||
    "";

  return `${exampleStart}|${resolvedWord}|${exampleEnd}|${synonyms}|${
    example2 ? example2 : ""
  }|${initialWord}|${initialWord.toLowerCase() == resolvedWord.toLowerCase()}|${
    synonyms ? true : false
  }|${example ? true : false}`;
};

export const createExtraExample = (scrapeResult) => {
  const { exampleElements } = scrapeResult;
  const examplesSorted = getExaplesSorted(exampleElements);

  const example2 = examplesSorted.length > 1 ? examplesSorted[1] : null;

  return example2 ? example2 : "";
};

function getExaplesSorted(examples) {
  return examples.length > 0
    ? examples.map((v) => v.textContent).sort((a, b) => a.length - b.length)
    : [];
}

function getSynonyms(synonymElements) {
  return synonymElements.length > 0
    ? synonymElements
        .slice(0, 10)
        .map((v) => v.text)
        .reduce((c, v) => c + ", " + v)
    : "";
}
