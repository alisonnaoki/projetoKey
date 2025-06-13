import { NavigationContainer } from '@react-navigation/native';
import DrawerRoutes from './src/routes/DrawerRoutes';
import { ThemeProvider } from './src/theme/themeContext';

export default function App() {
  return (
    <ThemeProvider>

      <NavigationContainer>
        <DrawerRoutes/>
      </NavigationContainer>

    </ThemeProvider>

  );
}
