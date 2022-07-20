import "./home.css";
import WordPronounce from "../components/WordPronounce";
import NewWord from "../components/NewWord";
import { ReactComponent as Clipboard } from "./../assets/svg/iconmonstr-clipboard-13.svg";

import { useContext } from "react";
import WordContext from "../context/WordContext";

function Home() {
  const { word } = useContext(WordContext);

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
      <div className="header-pronounce">
        <h2>Pronounce result</h2>
        <Clipboard onClick={copyPronounceText}></Clipboard>
      </div>
      <div className="pronounce-container">
        {word?.map((x, index) => {
          return (
            <div key={x.id}>
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
