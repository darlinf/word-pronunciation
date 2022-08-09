import React, { useState } from "react";

const Context = React.createContext({});

export function WordOrSentenceContextProvider({ children }) {
  const [choiceWordSentence, setChoiceWordSentence] = useState("word");

  return (
    <Context.Provider value={{ choiceWordSentence, setChoiceWordSentence }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
