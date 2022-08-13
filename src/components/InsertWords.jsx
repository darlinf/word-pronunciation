import "./InsertWords.css";
import useInsertWords from "../hooks/useInsertWords";
import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import NetworkError from "./NetworkError";

export default function InsertWords() {
  const { inputError, input, handleSubmit, errorNetwork } = useInsertWords();
  const { theme } = useContext(ThemeContext);

  return (
    <div className="form-container">
      <NetworkError errorNetwork={errorNetwork} />
      <form action="" onSubmit={handleSubmit}>
        <div className="error ">
          <input type="text" ref={input} placeholder="words"></input>
          {inputError && (
            <small style={theme.headerPronounce}>
              <p>please enter word or sentence</p>
            </small>
          )}
        </div>
        <button>Ok</button>
      </form>
    </div>
  );
}
