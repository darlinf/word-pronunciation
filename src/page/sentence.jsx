import "./sentence.css";
import { useState, useContext, useEffect, useRef } from "react";
import recogniseVoice from "../_herpers/recogniseVoice";
import { ReactComponent as Sound } from "../assets/svg/iconmonstr-sound-thin.svg";
import { ReactComponent as Microphone } from "../assets/svg/microphone.svg";
import speak from "../_herpers/speak";
import ThemeContext from "../context/ThemeContext";
import SentenceContext from "../context/SentenceContext";

export default function Sentence() {
  const [sentence, setSentence] = useState("");
  const [recoding, setRecoding] = useState(null);
  const { studyText } = useContext(SentenceContext);
  const { theme } = useContext(ThemeContext);

  const input = useRef();

  useEffect(() => {
    input.current.value = studyText;
    if (studyText) setStydySentence(studyText);
  }, [studyText]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setStydySentence(event.target[0].value);
  };

  const setStydySentence = (param) => {
    const uniqueWord = param
      .split(/[\W-\d]/g)
      .filter((x) => x !== "")
      .toString()
      .replace(/,/g, " ");

    if (uniqueWord === "") {
      setSentence(null);
      return;
    }

    setSentence(uniqueWord);
  };

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <div className="form-container">
        <form action="" onSubmit={handleSubmit}>
          <div className="error ">
            <input type="text" ref={input} placeholder="sentence"></input>
            {sentence === null && <small>please enter word or sentence</small>}
          </div>
          <button>Ok</button>
        </form>
      </div>
      {sentence && (
        <div className="sentenc-main-container" style={theme.headerPronounce}>
          <div className="sentence-container">
            <p>{sentence}</p>
            <Sound
              style={{ fill: "white", cursor: "pointer" }}
              className="sound"
              onClick={() => speak(sentence)}
            />
          </div>
          <div className="microphone-container">
            <Microphone
              style={{ fill: "white", cursor: "pointer" }}
              onClick={() => {
                console.log(recoding);
                setRecoding("...");
                recogniseVoice((e) => {
                  setRecoding(e);
                });
              }}
            />
            <div>{recoding || <p>“________________________”</p>}</div>
          </div>
        </div>
      )}
    </div>
  );
}
