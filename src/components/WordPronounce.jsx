import "./WordPronounce.css";
import { ReactComponent as Sound } from "../assets/svg/iconmonstr-sound-thin.svg";
import { ReactComponent as Pencil } from "../assets/svg/iconmonstr-pencil-thin.svg";
import { ReactComponent as Mark } from "../assets/svg/iconmonstr-check-mark-17.svg";
import { ReactComponent as Save } from "../assets/svg/iconmonstr-save.svg";
import { ReactComponent as Microphone } from "../assets/svg/microphone.svg";
import { ReactComponent as Synchronization } from "../assets/svg/iconmonstr-synchronization.svg";

import speak from "../_herpers/speak";
import recogniseVoice from "../_herpers/recogniseVoice";
import usePronounce from "../hooks/usePronounce";

export default function WordPronounce({ word, pronounce, id }) {
  const {
    setRecoding,
    setting,
    recoding,
    theme,
    loading,
    setEdit,
    handlerCreateAndEditWord,
    edit,
    inputText,
    setInputText,
  } = usePronounce({ word, pronounce, id });

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
              onChange={(event) => {
                setInputText(event.target.value);
              }}
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
