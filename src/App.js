import "./App.css";
import Home from "./page/home";
import SentencePronounce from "./page/sentencePronounce";
import { WordContextProvider } from "./context/WordContext";
import { SettingContextProvider } from "./context/SettingContext";

import { useContext, useEffect } from "react";
import ThemeContext from "./context/ThemeContext";

import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";

import styles from "./_herpers/stylesTheme";

let currentTheme = localStorage.getItem("theme");

console.log(currentTheme);
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
      <NavBar />
      <WordContextProvider>
        <SettingContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sentence-pronounce" element={<SentencePronounce />} />
          </Routes>
        </SettingContextProvider>
      </WordContextProvider>
    </div>
  );
}

export default App;
