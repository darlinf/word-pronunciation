import "./NewWord.css";
import { useContext } from "react";
import WordContext from "../../context/WordContext";

import { wordService } from "./../../_services/word.service";

export default function NewWord() {
  const { setWord } = useContext(WordContext);

  const handleSubmit = (event) => {
    wordService
      .getWordByWord(event.target[0].value)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
    event.preventDefault();
    setWord(event.target[0].value.split(" "));
  };
  return (
    <div className="form-container">
      <form action="" onSubmit={handleSubmit}>
        <textarea rows="1"></textarea>
        <button>Ok</button>
      </form>
    </div>
  );
}
