import { useState, useMemo, useEffect } from "react";

import { wordService } from "../_services/word.service";
import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import SettingContext from "../context/SettingContext";

let wordExist = false;

export default function usePronounce({ pronounce, word, id }) {
  const [edit, setEdit] = useState(pronounce === "");
  const [inputText, setInputText] = useState(pronounce);
  const [loading, setLoading] = useState(false);
  const [recoding, setRecoding] = useState(null);

  const { theme } = useContext(ThemeContext);
  const { setting } = useContext(SettingContext);

  wordExist = useMemo(() => (id === undefined ? false : true), [id]);

  let createNewWord = {
    word: word,
    pronounce: inputText,
  };

  useEffect(() => {
    setInputText(pronounce);
    setEdit(pronounce === "");
  }, [pronounce]);

  const createWort = (element) => {
    wordService
      .createWord(element)
      .then((data) => {
        wordExist = true;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const editWord = (element) => {
    setLoading(true);
    wordService
      .editWord(id, element)
      .then((data) => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlerCreateAndEditWord = () => {
    if (inputText !== pronounce) {
      editWord(id);
    }

    if (inputText !== "") {
      setEdit((x) => !x);
      if (wordExist) {
        editWord({ pronounce: inputText });
      } else {
        createWort(createNewWord);
      }
    }
  };

  return {
    setRecoding,
    setting,
    recoding,
    theme,
    loading,
    setEdit,
    handlerCreateAndEditWord,
    edit,
    pronounce,
    inputText,
  };
}
