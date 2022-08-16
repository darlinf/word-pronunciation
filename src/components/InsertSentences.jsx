import useInsertSentences from "../hooks/useInsertSentences";
import "./InsertSentences.css";

export default function InsertSentences() {
  const { sentence, handleSubmit, input } = useInsertSentences();

  return (
    <div>
      <div className="form-container">
        <form action="" onSubmit={handleSubmit}>
          <div className="error ">
            <input type="text" ref={input} placeholder="sentence"></input>
            {sentence === null && <small>please enter word or sentence</small>}
          </div>
          <button>Ok</button>
        </form>
      </div>
    </div>
  );
}
