export const sleep = (m) => new Promise((r) => setTimeout(r, m));

export const createResultRow = (reversoOutput, wrOutput) => {
  const {
    initialWord,
    exampleStart,
    resolvedWord,
    exampleEnd,
    synonyms,
    example2,
    isSameAsInitial,
  } = reversoOutput;

  const { audioSrc, prononsiation } = wrOutput;

  const row = [
    exampleStart,
    resolvedWord,
    exampleEnd,
    synonyms,
    example2 || "",
    prononsiation,
    audioSrc,
    initialWord,
    isSameAsInitial,
    synonyms ? true : false,
    exampleStart || exampleEnd ? true : false,
  ];

  return row.reduce((pV, cV) => (pV || "") + "|" + (cV || ""));
};
