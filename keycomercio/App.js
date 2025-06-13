import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import MaquinaStack from './src/routes/MaquinaStack';
import DrawerRoutes from './src/routes/DrawerRoutes';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <DrawerRoutes/>
      </NavigationContainer>
    </PaperProvider>
  );
}
