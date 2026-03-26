import { createContext, useContext, useMemo, useState } from 'react';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [chatBackground, setChatBackground] = useState('#ffffff');
  const [fontStyle, setFontStyle] = useState('System');

  const value = useMemo(
    () => ({ chatBackground, setChatBackground, fontStyle, setFontStyle }),
    [chatBackground, fontStyle]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
