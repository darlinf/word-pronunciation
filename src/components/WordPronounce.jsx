import "./WordPronounce.css";
import { ReactComponent as Sound } from "../assets/svg/iconmonstr-sound-thin.svg";
import { ReactComponent as Pencil } from "../assets/svg/iconmonstr-pencil-thin.svg";
import { ReactComponent as Mark } from "../assets/svg/iconmonstr-check-mark-17.svg";
import { ReactComponent as Save } from "../assets/svg/iconmonstr-save.svg";
import { ReactComponent as Microphone } from "../assets/svg/microphone.svg";
import { ReactComponent as Synchronization } from "../assets/svg/iconmonstr-synchronization.svg";
import { useState, useMemo, useEffect } from "react";

import { wordService } from "../_services/word.service";
import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import SettingContext from "../context/SettingContext";

import speak from "../_herpers/speak";
import recogniseVoice from "../_herpers/recogniseVoice";

let wordExist = false;

export default function WordPronounce({ word, pronounce, id }) {
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

  ///////////////////////////
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
  //////////////////////////

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

  const EditSave = () => {
    return edit ? (
      <Mark onClick={handlerCreateAndEditWord}></Mark>
    ) : (
      <Pencil className="pencil" onClick={() => setEdit((x) => !x)}></Pencil>
    );
  };

  const SynchronizationSave = () => {
    return id !== undefined ? (
      loading ? (
        <Synchronization style={{ fill: "white", marginLeft: 1, height: 15 }} />
      ) : (
        <Save style={{ fill: "white", marginLeft: 1, height: 15 }} />
      )
    ) : (
      <></>
    );
  };

  return (
    <div className="text-show-result" style={theme.textShowResult}>
      <div className="word">
        <p>{word}</p>
        <div
          style={{ marginLeft: 5, display: "flex", width: recoding ? 30 : 60 }}
        >
          <Sound
            className="sound"
            onClick={() =>
              speak(word, setting.pitch, setting.rate, setting.lang)
            }
          ></Sound>
          {!recoding && (
            <Microphone
              onClick={() => {
                console.log(recoding);
                setRecoding("...");
                recogniseVoice((e) => {
                  setRecoding(e);
                });
              }}
            ></Microphone>
          )}
        </div>
      </div>
      {recoding && (
        <div
          style={{
            width: "90%",
            height: 40,
            display: "flex",
            paddingLeft: 10,
            paddingRight: 10,
            justifyContent: "space-between",
          }}
        >
          <p>{recoding}</p>
          <Microphone
            onClick={() => {
              console.log(recoding);
              setRecoding("...");
              recogniseVoice((e) => {
                setRecoding(e);
              });
            }}
          ></Microphone>
        </div>
      )}

      <div className="pronounce">
        <EditSave />

        <div className="edit-text-container">
          {edit ? (
            <input
              placeholder="pronounce"
              type="text"
              onChange={(event) => setInputText(event.target.value)}
              value={inputText}
            />
          ) : (
            <p>{inputText}</p>
          )}
        </div>

        <SynchronizationSave />
      </div>
    </div>
  );
}
