// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import DrawerRoutes from './src/routes/DrawerRoutes';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Combine aqui as personalizações de tema se desejar
  const theme = isDarkTheme ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <DrawerRoutes toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      </NavigationContainer>
    </PaperProvider>
  );
}
