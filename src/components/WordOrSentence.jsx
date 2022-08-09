import "./WordOrSentence.css";
import ThemeContext from "../context/ThemeContext";
import WordOrSentenceContext from "../context/WordOrSentenceContext";
import { useContext } from "react";

export default function WordOrSentence() {
  const { theme } = useContext(ThemeContext);
  const { setChoiceWordSentence, choiceWordSentence } = useContext(
    WordOrSentenceContext
  );

  return (
    <div className="nav-bar-container">
      <ul>
        <li>
          <div
            style={theme.textColor}
            className={choiceWordSentence === "word" ? "nav-link-active" : ""}
            onClick={() => {
              setChoiceWordSentence("word");
            }}
          >
            Word pronounce
          </div>
        </li>

        <li>
          <div
            style={theme.textColor}
            className={
              choiceWordSentence === "sentence" ? "nav-link-active" : ""
            }
            onClick={() => {
              setChoiceWordSentence("sentence");
            }}
          >
            Sentence pronounce
          </div>
        </li>
      </ul>
    </div>
  );
}
