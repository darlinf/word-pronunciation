import React, { useState } from "react";

const Context = React.createContext({});

export function SentenceContextProvider({ children }) {
  const [studyText, setStudyText] = useState(null);

  return (
    <Context.Provider value={{ studyText, setStudyText }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
