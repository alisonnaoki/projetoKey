import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper'; // Importando o hook do tema do Paper

import MaquinaListaScreen from '../screens/MaquinaListaScreen';
import MaquinaForm from '../maquinas/MaquinaForm';
import MaquinaStatus from '../maquinas/MaquinaStatus';
import MaquinaQRCode from '../maquinas/MaquinaQRcode';

const Stack = createStackNavigator();

export default function MaquinaStack() {
  const { colors } = useTheme(); // Obtendo as cores do tema do Paper

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background, // Cor de fundo do cabeçalho
        },
        headerTintColor: colors.text, // Cor do texto do cabeçalho
        headerTitleAlign: 'center', // Alinhamento do título
      }}
    >
      <Stack.Screen
        name='MaquinaListaScreen'
        component={MaquinaListaScreen}
        options={{
          title: 'Lista de Máquinas',
        }}
      />

      <Stack.Screen
        name='MaquinaStatus'
        component={MaquinaStatus}
        options={{
          title: 'Status da Máquina',
        }}
      />

      <Stack.Screen
        name='MaquinaForm'
        component={MaquinaForm}
        options={{
          title: 'Cadastro de Máquinas',
        }}
      />

      <Stack.Screen
        name='MaquinaQRCode'
        component={MaquinaQRCode}
        options={{
          title: 'QR code gerado',
        }}
      />
    </Stack.Navigator>
  );
}
