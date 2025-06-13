import { createStackNavigator } from '@react-navigation/stack'

import MaquinaListaScreen from '../screens/MaquinaListaScreen'
import MaquinaForm from '../maquinas/MaquinaForm'
import MaquinaStatus from '../maquinas/MaquinaStatus'
import MaquinaQRCode from '../maquinas/MaquinaQRcode'


const Stack = createStackNavigator()

export default function MaquinaStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name='MaquinaListaScreen'
        component={MaquinaListaScreen}
        options={{
          title: 'Lista de Máquinas',
          headerTitleAlign: 'center'
        }}
      />

      <Stack.Screen
        name='MaquinaStatus'
        component={MaquinaStatus}
        options={{
          title: 'Cadastro de Máquinas',
          headerTitleAlign: 'center'
        }}
      />

      <Stack.Screen
        name='MaquinaForm'
        component={MaquinaForm}
        options={{
          title: 'Cadastro de Máquinas',
          headerTitleAlign: 'center'
        }}
      />

      <Stack.Screen
        name='MaquinaQRCode'
        component={MaquinaQRCode}
        options={{
          title: 'Cadastro de Máquinas',
          headerTitleAlign: 'center'
        }}
      />

    </Stack.Navigator>
  )
}