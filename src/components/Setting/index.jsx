import { useState } from "react";
import { ReactComponent as SettingIcon } from "../../assets/svg/setting.svg";
import { ReactComponent as CloseIcon } from "../../assets/svg/close.svg";

import ThemeContext from "../../context/ThemeContext";
import SettingContext from "../../context/SettingContext";
import { useContext } from "react";

import "./Setting.css";

export default function Setting() {
  const [showSetting, setShowSetting] = useState(false);
  const { theme } = useContext(ThemeContext);

  const { setSetting, setting } = useContext(SettingContext);

  const [voiceList, setVoiceList] = useState([]);

  populateVoiceList((voices) => {
    setVoiceList(voices);
  });

  const handleSetting = (key, value) => {
    setSetting((x) => {
      let newSetting = { ...x, [key]: value };
      localStorage.setItem("Speech_setting", JSON.stringify(newSetting));
      return newSetting;
    });
  };

  return (
    <div>
      <div>
        <SettingIcon
          className={
            showSetting === true ? "removeSettingMenu" : "showSettingMenu"
          }
          style={{ position: "absolute" }}
          onClick={() => {
            setShowSetting((x) => !x);
          }}
        />
        <CloseIcon
          className={
            showSetting === false ? "removeSettingMenu" : "showSettingMenu"
          }
          onClick={() => {
            setShowSetting((x) => !x);
          }}
        />
      </div>

      {
        <div
          style={theme.headerPronounce}
          className={
            "setting-container " +
            (showSetting === false ? "removeSettingMenu" : "showSettingMenu")
          }
        >
          <form>
            <div className="rate">
              <label>Rate</label>
              <input
                type="range"
                min="0.5"
                max="2"
                value={setting.rate}
                onChange={(x) => {
                  handleSetting("rate", x.target.value);
                }}
                step="0.1"
              />
              <div className="rate-value">{setting.rate}</div>
              <div className="clearfix"></div>
            </div>
            <div className="pitch">
              <label>Pitch</label>
              <input
                type="range"
                min="0"
                max="2"
                value={setting.pitch}
                onChange={(x) => {
                  handleSetting("pitch", x.target.value);
                }}
                step="0.1"
              />
              <div className="pitch-value">{setting.pitch}</div>
              <div className="clearfix"></div>
            </div>
            <select
              onChange={(e) => {
                handleSetting("lang", e.target.value);
              }}
              className="select-lang"
              value={setting.lang}
            >
              {voiceList
                .filter((voice) => voice.voiceURI.includes("English"))
                .map((voice2, index) => (
                  <option
                    value={voice2.voiceURI}
                    key={index}
                    data-lang={voice2.lang}
                    data-name={voice2.name}
                  >
                    {voice2.voiceURI}
                  </option>
                ))}
            </select>
          </form>
        </div>
      }
    </div>
  );
}

function populateVoiceList(callback) {
  const callBackEvent = () => {
    const voicesList = window.speechSynthesis.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase();
      const bname = b.name.toUpperCase();

      if (aname < bname) {
        return -1;
      } else if (aname === bname) {
        return 0;
      } else {
        return +1;
      }
    });
    callback(voicesList);
  };

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = callBackEvent;
  }
}
