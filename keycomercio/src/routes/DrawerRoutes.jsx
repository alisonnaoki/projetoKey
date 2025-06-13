// src/navigation/DrawerRoutes.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaquinaStack from './MaquinaStack'; 
import ConfigSscreen from '../screens/ConfigSscreen';
import QRCodeScannerScreen from '../screens/QRCodeScannerScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/themeContext'; // Importando o hook do tema

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  const { colors, dark } = useTheme(); // Obtendo as cores do tema

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
        },
        drawerActiveBackgroundColor: dark ? '#333333' : '#e6e6e6',
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: dark ? '#aaaaaa' : '#666666',
      }}
    >
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
          drawerIcon: ({ color, size }) => <Ionicons name="qr-code-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}
