import React, { useState } from "react";

const Context = React.createContext({});

export function SettingContextProvider({ children }) {
  const settingStorage = JSON.parse(localStorage.getItem("Speech_setting"));

  let initialValues = null;
  if (settingStorage === null)
    initialValues = { pitch: "1", rate: "1", lang: "" };
  else initialValues = settingStorage;

  const [setting, setSetting] = useState(initialValues);

  return (
    <Context.Provider value={{ setting, setSetting }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
