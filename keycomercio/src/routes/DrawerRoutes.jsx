// src/navigation/DrawerRoutes.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaquinaStack from './MaquinaStack'; 
import ConfigScreen from '../screens/ConfigSscreen' // Corrigido o nome do arquivo
import QRCodeScannerScreen from '../screens/QRCodeScannerScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper'; // Importando o hook useTheme

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  const { colors } = useTheme(); // Obtendo as cores do tema do PaperProvider

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
        drawerActiveBackgroundColor: '#e6e6e6', // Cor fixa para o tema claro
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: '#666666', // Cor fixa para o tema claro
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
        component={ConfigScreen} // Corrigido o nome do componente
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
