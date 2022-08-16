import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeContextProvider } from "./context/ThemeContext";
import { SentenceContextProvider } from "./context/SentenceContext";
import { WordOrSentenceContextProvider } from "./context/WordOrSentenceContext";
import { WordContextProvider } from "./context/WordContext";
import { SettingContextProvider } from "./context/SettingContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <WordOrSentenceContextProvider>
        <SentenceContextProvider>
          <WordContextProvider>
            <SettingContextProvider>
              <App />
            </SettingContextProvider>
          </WordContextProvider>
        </SentenceContextProvider>
      </WordOrSentenceContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
