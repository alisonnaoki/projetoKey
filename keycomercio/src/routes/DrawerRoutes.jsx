// src/navigation/DrawerRoutes.js
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaquinaStack from './MaquinaStack'; 
import ConfigSscreen from '../screens/ConfigSscreen';
import QRCodeScannerScreen from '../screens/QRCodeScannerScreen';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="MaquinaStack"
        component={MaquinaStack} 
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Configuracoes"
        component={ConfigSscreen}
        options={{
          title: 'Configurações',
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="QRCodeScanner"
        component={QRCodeScannerScreen}
        options={{
          title: 'Scanner',
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}
