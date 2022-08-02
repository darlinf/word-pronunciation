import "./ToggleTheme.css";
import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import styles from "../../_herpers/stylesTheme";

import { ReactComponent as Moon } from "../../assets/svg/moon.svg";
import { ReactComponent as Sun } from "../../assets/svg/sun.svg";

let currentTheme = localStorage.getItem("theme");

export default function ToggleTheme() {
  const { setTheme } = useContext(ThemeContext);

  const handlerTheme = () => {
    currentTheme = currentTheme === "dark" ? "white" : "dark";
    localStorage.setItem("theme", currentTheme);
    styles[currentTheme].body();
    setTheme(styles[currentTheme]);
  };

  return (
    <div>
      <div>
        <button
          className="toggle-theme-container"
          type="button"
          title={`Switch between dark and light mode (currently ${currentTheme} mode)`}
          aria-label={`Switch between dark and light mode (currently ${currentTheme} mode)`}
        >
          {currentTheme === "dark" ? (
            <Moon onClick={handlerTheme} />
          ) : (
            <Sun onClick={handlerTheme} />
          )}
        </button>
      </div>
    </div>
  );
}
