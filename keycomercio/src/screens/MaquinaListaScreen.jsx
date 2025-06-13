import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Button, Card, Text } from 'react-native-paper'
import MaquinaService from '../maquinas/MaquinaService'

export default function MaquinaListaScreen({ navigation, route }) {
 
  const { id } = route.params || {};
  const [maquinas, setMaquinas] = useState([])

  useEffect(() => {
    buscarMaquinas()
  }, [])

  async function buscarMaquinas() {
    const listaMaquinas = await MaquinaService.listar()
    setMaquinas(listaMaquinas)
  }

  async function excluirMaquina(id) {
    await MaquinaService.remover(id)
    buscarMaquinas()
    alert('Máquina excluída com sucesso!')
  }

  function mostrarStatus(status) {
    switch (status) {
      case 'esperando_pecas':
        return 'Esperando Peças'
      case 'manutencao_realizada':
        return 'Manutenção Realizada'
      case 'manutencao_andamento':
        return 'Manutenção em Andamento'
      default:
        return 'Status Desconhecido'
    }
  }

  return (
    <View>
      <Button
        style={{ margin: 10 }}
        mode='contained'
        icon='plus'
        onPress={() => navigation.navigate('MaquinaForm')}
      >
        Cadastrar
      </Button>

      <FlatList
        data={maquinas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ margin: 10 }}>
            <Card.Content>
              <Text>ID: {item.id}</Text>
              <Text>Modelo: {item.modelo}</Text>
              <Text>Marca: {item.marca}</Text>
              <Text>Cliente: {item.cliente}</Text>
              <Text>Técnico: {item.tecnico}</Text>
              <Text>Status: {mostrarStatus(item.status)}</Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                icon='eye' 
                onPress={() => navigation.navigate('MaquinaStatus', { id: item.id })} 
              />
              <Button 
                icon='delete' 
                onPress={() => excluirMaquina(item.id)} 
              />
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({})
