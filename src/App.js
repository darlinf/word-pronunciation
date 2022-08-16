import Word from "./page/word";
import { useContext, useEffect } from "react";
import ThemeContext from "./context/ThemeContext";
import WordOrSentence from "./components/WordOrSentence";
import styles from "./_herpers/stylesTheme";
import SentencePronounce from "./components/SentencePronounce";

let currentTheme = localStorage.getItem("theme");

if (currentTheme === null) {
  currentTheme = "white";
  localStorage.setItem("theme", currentTheme);
}

function App() {
  const { setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setTheme(styles[currentTheme]);
    styles[currentTheme].body("initial");
  }, [setTheme]);

  return (
    <div>
      <SentencePronounce />
      <WordOrSentence />
      <Word />
    </div>
  );
}

export default App;
