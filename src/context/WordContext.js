import React, { useState } from "react";

const Context = React.createContext({});

export function WordContextProvider({ children }) {
  const [word, setWord] = useState(null);

  return (
    <Context.Provider value={{ word, setWord }}>{children}</Context.Provider>
  );
}

export default Context;
