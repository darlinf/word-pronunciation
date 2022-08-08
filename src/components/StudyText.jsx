import { useContext, useRef, useState } from "react";
import "./StudyText.css";
import StudyTextContext from "../context/StudyTextContext";
import ThemeContext from "../context/ThemeContext";

let lastIndex = undefined;

export default function StudyText() {
  const [pasteText, setPasteText] = useState([]);
  const { setStudyText } = useContext(StudyTextContext);
  const { theme } = useContext(ThemeContext);
  const listOfPronounce = useRef();

  const handlePasteText = () => {
    navigator.clipboard.readText().then((text) => {
      setPasteText(text.split("\n"));
      console.log(pasteText);
    });
  };

  const selectItem = (index) => {
    if (lastIndex !== undefined) {
      listOfPronounce.current.children[lastIndex].style =
        "background: " + theme.textShowResult.background;
    }
    listOfPronounce.current.children[index].style =
      "background: " + theme.headerPronounce.background;
    lastIndex = index;
  };

  return (
    <div className="study-text-container" style={theme.pronounceContainer}>
      <button onClick={handlePasteText}>Paste</button>
      {pasteText[0] && (
        <div ref={listOfPronounce} className="study-text-item-container">
          {pasteText.map((x, index) => (
            <div
              style={theme.textShowResult}
              onClick={() => {
                selectItem(index);
                setStudyText(x);
              }}
              className="study-text-item"
              key={index}
            >
              {x}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
