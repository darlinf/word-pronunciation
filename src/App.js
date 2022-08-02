import "./App.css";
import Home from "./page/home";
import { WordContextProvider } from "./context/WordContext";

import { useContext, useEffect } from "react";
import ThemeContext from "./context/ThemeContext";

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
      <WordContextProvider>
        <Home></Home>
      </WordContextProvider>
    </div>
  );
}

export default App;
