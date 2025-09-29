import EN from "../Lang/entranslate.json";
import KH from "../Lang/khtranslate.json";

export const translateLauguage = (lang) => {
  let language = JSON.parse(JSON.stringify(EN));
  if (lang === "kh") { language = JSON.parse(JSON.stringify(KH)); }
  const t = (e) => {
    return language[e] ? language[e] : e;
  };
  return { t };
};
