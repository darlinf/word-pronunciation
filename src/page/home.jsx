import "./home.css";
import WordPronounce from "../components/WordPronounce";
import NewWord from "../components/NewWord";
import ToggleTheme from "../components/ToggleTheme";
import { ReactComponent as Clipboard } from "./../assets/svg/iconmonstr-clipboard-13.svg";

import { useContext } from "react";
import WordContext from "../context/WordContext";
import ThemeContext from "../context/ThemeContext";

function Home() {
  const { word } = useContext(WordContext);
  const { theme } = useContext(ThemeContext);

  const copyPronounceText = () => {
    navigator.clipboard.writeText(createdClipboardText());
  };

  const createdClipboardText = () => {
    let textToClipboard = "";

    /*word.forEach((element) => {
      textToClipboard += element.word + " ";
    });

    textToClipboard += "\n ";*/

    word.forEach((element) => {
      textToClipboard += element.pronounce + "_";
    });
    return textToClipboard;
  };

  return (
    <div style={{ margin: 30 }}>
      <NewWord></NewWord>
      <div className="header-pronounce" style={theme.headerPronounce}>
        <h2>Pronounce result</h2>
        <div
          style={{
            display: "flex",
          }}
        >
          <Clipboard onClick={copyPronounceText}></Clipboard>
          <div style={{ marginLeft: 5 }}>
            <ToggleTheme />
          </div>
        </div>
      </div>
      <div className="pronounce-container" style={theme.pronounceContainer}>
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
      </div>
    </div>
  );
}

export default Home;
