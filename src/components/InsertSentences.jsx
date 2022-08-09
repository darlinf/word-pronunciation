import "./InsertSentences.css";
import { useState, useContext, useEffect, useRef, useCallback } from "react";
//import ThemeContext from "../context/ThemeContext";
import SentenceContext from "../context/SentenceContext";

export default function InsertSentences() {
  const [sentence, setSentence] = useState("");
  const { studyText, setStudyText } = useContext(SentenceContext);
  //const { theme } = useContext(ThemeContext);

  const input = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    setStudySentence(event.target[0].value);
  };

  const setStudySentence = useCallback(
    (param) => {
      const uniqueWord = param
        .split(/[\W-\d]/g)
        .filter((x) => x !== "")
        .toString()
        .replace(/,/g, " ");

      if (uniqueWord === "") {
        setSentence(null);
        return;
      }

      setStudyText(uniqueWord);
      setSentence(uniqueWord);
    },
    [setStudyText]
  );

  useEffect(() => {
    input.current.value = studyText;
    if (studyText) setStudySentence(studyText);
  }, [studyText, setStudySentence]);

  return (
    <div>
      <div className="form-container">
        <form action="" onSubmit={handleSubmit}>
          <div className="error ">
            <input type="text" ref={input} placeholder="sentence"></input>
            {sentence === null && <small>please enter word or sentence</small>}
          </div>
          <button>Ok</button>
        </form>
      </div>
    </div>
  );
}
