import { useState, useContext, useEffect, useRef, useCallback } from "react";
import SentenceContext from "../context/SentenceContext";

export default function useInsertSentences() {
  const [sentence, setSentence] = useState("");
  const { studyText, setStudyText } = useContext(SentenceContext);

  const input = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    setStudySentence(event.target[0].value);
  };

  const setStudySentence = useCallback(
    (param) => {
      const uniqueWord = param
        //.split(/[\W-\d]/g)
        .split(" ")
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

  return { sentence, handleSubmit, input };
}
