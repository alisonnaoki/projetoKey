import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaquinaStack from './MaquinaStack';
import ConfigScreen from '../screens/ConfigSscreen';
import QRCodeScannerScreen from '../screens/QRCodeScannerScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const Drawer = createDrawerNavigator();

export default function DrawerRoutes({ toggleTheme, isDarkTheme }) {
  const { colors } = useTheme();

  const drawerActiveBackgroundColor = isDarkTheme ? '#555' : '#e6e6e6';
  const drawerInactiveTintColor = isDarkTheme ? '#aaa' : '#666666';

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
        drawerActiveBackgroundColor: drawerActiveBackgroundColor,
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: drawerInactiveTintColor,
      }}
    >
      <Drawer.Screen
        name="MaquinaStack"
        component={MaquinaStack}
        options={{
          title: 'Máquinas',
          drawerIcon: ({ color, size }) => <Ionicons name="hardware-chip-outline" size={size} color={color} />,
        }}

        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            navigation.navigate('MaquinaStack', { screen: 'MaquinaListaScreen' });
          },
        })}
      />
      <Drawer.Screen
        name="Configuracoes"
        children={(props) => (
          <ConfigScreen {...props} toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
        )}
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