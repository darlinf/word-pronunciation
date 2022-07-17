import "./WordPronounce.css";
import { ReactComponent as Sound } from "../../assets/svg/iconmonstr-sound-thin.svg";
import { ReactComponent as Pencil } from "../../assets/svg/iconmonstr-pencil-thin.svg";
import { ReactComponent as Mark } from "../../assets/svg/iconmonstr-check-mark-17.svg";
import { useState, useEffect } from "react";
import { useContext } from "react";
import WordContext from "../../context/WordContext";

import { wordService } from "./../../_services/word.service";

export default function WordPronounce({ wordPronounce }) {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    wordService
      .getWordByWord("word")
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="text-show">
      <div className="word">
        <p>{wordPronounce}</p>
        <button>
          <Sound></Sound>
        </button>
      </div>
      <div className="pronounce">
        <button
          onClick={() => {
            setEdit((x) => !x);
          }}
        >
          {edit ? <Mark></Mark> : <Pencil></Pencil>}
        </button>
        <div className="edit-text-container">
          {edit ? <input type="text" /> : <p>furst</p>}
        </div>
      </div>
    </div>
  );
}
