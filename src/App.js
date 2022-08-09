import "./App.css";
import Word from "./page/word";
import Sentence from "./page/sentence";
import { WordContextProvider } from "./context/WordContext";
import { SettingContextProvider } from "./context/SettingContext";

import { useContext, useEffect } from "react";
import ThemeContext from "./context/ThemeContext";

import { Routes, Route } from "react-router-dom";

import WordOrSentence from "./components/WordOrSentence";

import styles from "./_herpers/stylesTheme";
import SentencePronounce from "./components/SentencePronounce";
import { SentenceContextProvider } from "./context/SentenceContext";
import { WordOrSentenceContextProvider } from "./context/WordOrSentenceContext";

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
      <WordOrSentenceContextProvider>
        <SentenceContextProvider>
          <SentencePronounce />
          <WordOrSentence />
          <WordContextProvider>
            <SettingContextProvider>
              <Routes>
                <Route path="/" element={<Word />} />
                <Route path="/sentence" element={<Sentence />} />
              </Routes>
            </SettingContextProvider>
          </WordContextProvider>
        </SentenceContextProvider>
      </WordOrSentenceContextProvider>
    </div>
  );
}

export default App;
