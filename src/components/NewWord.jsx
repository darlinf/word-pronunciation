import "./NewWord.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import WordContext from "../context/WordContext";

import StudyTextContext from "../context/StudyTextContext";

import { wordService } from "../_services/word.service";

export default function NewWord() {
  const { setWord } = useContext(WordContext);
  const [inputError, setInputError] = useState(false);
  const { studyText } = useContext(StudyTextContext);

  const input = useRef();

  const getWord = useCallback(
    (param) => {
      const uniqueWord = param
        .split(/[\W-\d]/g)
        .filter((x) => x !== "")
        .toString()
        .replace(/,/g, " ");

      if (uniqueWord === "") {
        setInputError(true);
        return;
      }

      setInputError(false);

      wordService
        .getWordByWord(uniqueWord)
        .then((data) => {
          setWord([]);
          setWord(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [setWord]
  );

  useEffect(() => {
    input.current.value = studyText;
    if (studyText) getWord(studyText);
  }, [studyText, getWord]);

  const handleSubmit = (event) => {
    event.preventDefault();
    getWord(event.target[0].value);
  };

  return (
    <div className="form-container">
      <form action="" onSubmit={handleSubmit}>
        <div className="error ">
          <input type="text" ref={input} placeholder="words"></input>
          {inputError && <small>please enter word or sentence</small>}
        </div>
        <button>Ok</button>
      </form>
    </div>
  );
}
