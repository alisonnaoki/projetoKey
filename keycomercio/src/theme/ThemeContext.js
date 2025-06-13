import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criação do contexto de tema
const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => {},
  colors: {
    background: '#ffffff',
    text: '#000000',
  },
});

// Provider do tema
export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);

  const lightColors = {
    background: '#FFFFFF',
    text: '#000000',
  };

  const darkColors = {
    background: '#121212',
    text: '#E0E0E0',
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@themeDark');
        if (storedTheme !== null) {
          setDark(storedTheme === 'true');
        }
      } catch (e) {
        console.error('Erro ao carregar o tema:', e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newDark = !dark;
      setDark(newDark);
      await AsyncStorage.setItem('@themeDark', newDark.toString());
    } catch (e) {
      console.error('Erro ao salvar o tema:', e);
    }
  };

  const colors = dark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para consumir o contexto do tema
export const useTheme = () => useContext(ThemeContext);
