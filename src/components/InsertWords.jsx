import "./InsertWords.css";
import useInsertWords from "../hooks/useInsertWords";

export default function InsertWords() {
  const { inputError, input, handleSubmit } = useInsertWords();

  return (
    <div className="form-container">
      <form action="" onSubmit={handleSubmit}>
        <div className="error ">
          <input type="text" ref={input} placeholder="words"></input>
          {inputError && <small>please enter word or sentence</small>}
        </div>
        <button>Ok</button>
      </form>
    </div>
  );
}
