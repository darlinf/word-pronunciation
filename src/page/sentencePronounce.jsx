import "./sentencePronounce.css";
import { useState } from "react";
import recogniseVoice from "../_herpers/recogniseVoice";
import { ReactComponent as Sound } from "../assets/svg/iconmonstr-sound-thin.svg";
import { ReactComponent as Microphone } from "../assets/svg/microphone.svg";
import speak from "../_herpers/speak";

export default function SentencePronounce() {
  const [sentence, setSentence] = useState("");
  const [recoding, setRecoding] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const uniqueWord = event.target[0].value
      .split(/[\W-\d]/g)
      .filter((x) => x !== "")
      .toString()
      .replace(/,/g, " ");

    console.log(uniqueWord);

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
            <input type="text" placeholder="sentence"></input>
            {sentence === null && <small>please enter word or sentence</small>}
          </div>
          <button>Ok</button>
        </form>
      </div>
      {sentence && (
        <div className="sentenc-main-container">
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
            <p>{recoding || <p>“________________________”</p>}</p>
          </div>
        </div>
      )}
    </div>
  );
}
