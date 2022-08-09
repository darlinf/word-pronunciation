import recogniseVoice from "../_herpers/recogniseVoice";
import { ReactComponent as Sound } from "../assets/svg/iconmonstr-sound-thin.svg";
import { ReactComponent as Microphone } from "../assets/svg/microphone.svg";
import speak from "../_herpers/speak";
import { useState, useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import SentenceContext from "../context/SentenceContext";

export default function SentenceAndPronounce() {
  const [recoding, setRecoding] = useState(null);
  const { theme } = useContext(ThemeContext);
  const { studyText } = useContext(SentenceContext);

  return (
    <>
      {studyText && (
        <div className="sentenc-main-container" style={theme.textShowResult}>
          <div className="sentence-container">
            <p>{studyText}</p>
            <Sound
              style={{ fill: "white", cursor: "pointer" }}
              className="sound"
              onClick={() => speak(studyText)}
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
    </>
  );
}
