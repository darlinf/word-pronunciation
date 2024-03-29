import { useCallback, useContext, useEffect, useRef, useState } from "react";
import WordContext from "../context/WordContext";

import SentenceContext from "../context/SentenceContext";

import { wordService } from "../_services/word.service";

export default function useInsertWords() {
  const { setWord } = useContext(WordContext);
  const [inputError, setInputError] = useState(false);
  const { studyText } = useContext(SentenceContext);
  const [errorNetwork, setNetworkError] = useState(false);

  const input = useRef();

  const getWord = useCallback(
    (param) => {
      const uniqueWord = param
        //.split(/[\W-\d]/g)
        .split(" ")
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
          setWord(data.data);
        })
        .catch((error) => {
          console.error(error);
          setNetworkError(true);
        });
    },
    [setWord, setNetworkError]
  );

  useEffect(() => {
    input.current.value = studyText;
    if (studyText) getWord(studyText);
  }, [studyText, getWord]);

  const handleSubmit = (event) => {
    event.preventDefault();
    getWord(event.target[0].value);
  };

  return { inputError, input, handleSubmit, errorNetwork };
}
