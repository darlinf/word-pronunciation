import "./WordPronounce.css";
import { ReactComponent as Sound } from "../../assets/svg/iconmonstr-sound-thin.svg";
import { ReactComponent as Pencil } from "../../assets/svg/iconmonstr-pencil-thin.svg";
import { ReactComponent as Mark } from "../../assets/svg/iconmonstr-check-mark-17.svg";
import { ReactComponent as Save } from "../../assets/svg/iconmonstr-save.svg";
import { ReactComponent as Synchronization } from "../../assets/svg/iconmonstr-synchronization.svg";
import { useState, useMemo } from "react";

import { wordService } from "./../../_services/word.service";
import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import SettingContext from "../../context/SettingContext";

let wordExist = false;

export default function WordPronounce({ word, pronounce, id }) {
  const [edit, setEdit] = useState(pronounce === "");
  const [inputText, setInputText] = useState(pronounce);
  const [loading, setLoading] = useState(false);

  const { theme } = useContext(ThemeContext);
  const { setting } = useContext(SettingContext);

  console.log(setting);

  wordExist = useMemo(() => (id === undefined ? false : true), [id]);

  let createNewWord = {
    word: word,
    pronounce: inputText,
  };

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
        <Sound
          className="sound"
          onClick={() => speak(word, setting.pitch, setting.rate, setting.lang)}
        ></Sound>
      </div>

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

function speak(
  textToSpeak = "hello",
  pitchV = 0.7,
  rateV = 0.5,
  voice = "Google US English"
) {
  const synth = window.speechSynthesis;
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }

  if (textToSpeak !== "") {
    const utterThis = new SpeechSynthesisUtterance(textToSpeak);

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    let voices = synth.getVoices();

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === voice) {
        utterThis.voice = voices[i];
        break;
      }
    }

    utterThis.pitch = pitchV;
    utterThis.rate = rateV;
    synth.speak(utterThis);
  }
}
