import "./NewWord.css";
import { useContext, useState } from "react";
import WordContext from "../context/WordContext";

import { wordService } from "../_services/word.service";

export default function NewWord() {
  const { setWord } = useContext(WordContext);
  const [inputError, setInputError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const uniqueWord = event.target[0].value
      .split(/[\W-\d]/g)
      .filter((x) => x !== "")
      .toString()
      .replace(/,/g, " ");

    console.log(uniqueWord);

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
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="form-container">
      <form action="" onSubmit={handleSubmit}>
        <div className="error ">
          <input type="text" placeholder="words"></input>
          {inputError && <small>please enter word or sentence</small>}
        </div>
        <button>Ok</button>
      </form>
    </div>
  );
}
