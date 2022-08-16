import "./word.css";
import WordPronounce from "../components/WordPronounce";
import InsertWords from "../components/InsertWords";
import ToggleTheme from "../components/ToggleTheme";
import Setting from "../components/Setting";
import { ReactComponent as Clipboard } from "./../assets/svg/iconmonstr-clipboard-13.svg";

import { useContext } from "react";
import WordContext from "../context/WordContext";
import ThemeContext from "../context/ThemeContext";
import WordOrSentenceContext from "../context/WordOrSentenceContext";
import InsertSentences from "../components/InsertSentences";
import SentenceAndPronounce from "../components/SentenceAndPronounce";

function Home() {
  const { word } = useContext(WordContext);
  const { theme } = useContext(ThemeContext);
  const { choiceWordSentence } = useContext(WordOrSentenceContext);

  const copyPronounceText = () => {
    navigator.clipboard.writeText(createdClipboardText());
  };

  const createdClipboardText = () => {
    let textToClipboard = "";

    word.forEach((element) => {
      textToClipboard += element.pronounce + "_";
    });
    return textToClipboard;
  };

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <div className="header-pronounce" style={theme.headerPronounce}>
        {choiceWordSentence === "word" ? (
          <InsertWords></InsertWords>
        ) : (
          <InsertSentences></InsertSentences>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Clipboard onClick={copyPronounceText}></Clipboard>
          <div style={{ marginLeft: 5 }}>
            <ToggleTheme />
          </div>
          <div style={{ marginLeft: 5 }}>
            <Setting />
          </div>
        </div>
      </div>
      <div className="pronounce-container" style={theme.pronounceContainer}>
        {choiceWordSentence === "word" ? (
          <>
            {word?.map((x, index) => {
              return (
                <div key={index}>
                  <WordPronounce
                    word={x.word}
                    pronounce={x.pronounce}
                    id={x.id}
                  ></WordPronounce>
                </div>
              );
            })}
          </>
        ) : (
          <SentenceAndPronounce></SentenceAndPronounce>
        )}
      </div>
    </div>
  );
}

export default Home;
