import { useRef, useState } from "react";
import { wordService } from "../_services/word.service";
import "./SentencePronounceWord.css";
import WordPronounce from "./WordPronounce";
import ThemeContext from "../context/ThemeContext";
import { useContext } from "react";
import OutSideClick from "../components/OutSideClick";

let pronounce = "";
let id = 0;

export default function SentencePronounceWord({ word }) {
  const [showWordDetails, setShowWordDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  //const [sizeElement, setSizeElement] = useState(0);
  const popupContainer = useRef();
  /*useEffect(() => {
    if (showWordDetails) setSizeElement(popupContainer.current.offsetWidth);
    console.log(popupContainer);
  }, [showWordDetails]);*/

  const getWord = (param) => {
    if (showWordDetails === false) {
      setLoading(true);

      wordService
        .getWordByWord(param)
        .then((reponse) => {
          pronounce = reponse.data[0].pronounce;
          id = reponse.data[0].id;

          setShowWordDetails(true);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      setShowWordDetails(false);
    }
  };

  return (
    <>
      <div
        className="popup"
        onClick={() => {
          getWord(word);
        }}
      >
        <span style={{ cursor: "pointer" }}>{word}</span>

        {(loading || showWordDetails) && (
          <span className="show popuptext" id="myPopup">
            <div
              ref={popupContainer}
              className="blur-container"
              style={{
                position: "relative",
              }}
            >
              {showWordDetails && (
                <OutSideClick setShowWordDetails={setShowWordDetails}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <WordPronounce
                      word={word}
                      pronounce={pronounce}
                      id={id}
                    ></WordPronounce>
                  </div>
                </OutSideClick>
              )}
              {loading && (
                <div className="loading" style={theme.textShowResult}>
                  <div className="spinner"></div>
                </div>
              )}
            </div>
          </span>
        )}
      </div>
      <span>&nbsp;</span>
    </>
  );
}
