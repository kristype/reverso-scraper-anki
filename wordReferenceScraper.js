import axios from "axios";
import JSDOM from "jsdom";

export const lookUpWordWr = async (inputWord) => {
  console.log(`Scraping word on wr: ${inputWord}`);

  let result = null;
  try {
    result = await axios.get(
      `https://www.wordreference.com/fren/${encodeURI(inputWord)}`
    );
  } catch (error) {
    console.log("error", error);
    return createResult();
  }

  const { data } = result;

  const dom = new JSDOM.JSDOM(data);

  const elements = Array.from(
    dom.window.document.querySelectorAll("audio source")
  );
  
  const audioUrls = elements
    .map((v) => v.src)
    .filter((v) => v.indexOf("fr/fr") > 0);

  const prononsiation = dom.window.document.getElementById("pronWR")
    ?.textContent;

  return createResult(audioUrls, prononsiation);
};

export const createWrOutput = (scrapeResult) => {
  const { audioUrls, prononsiation } = scrapeResult;

  return {
    audioSrc: audioUrls.length > 0 ? audioUrls[0] : null,
    prononsiation,
  };
};
function createResult(audioUrls, prononsiation) {
  return {
    audioUrls: audioUrls || [],
    prononsiation,
  };
}
