import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import MaquinaService from '../maquinas/MaquinaService';
import { useTheme } from '../theme/themeContext';

export default function MaquinaListaScreen({ navigation, route }) {
  const { colors, dark } = useTheme();

  const [maquinas, setMaquinas] = useState([]);

  useEffect(() => {
    buscarMaquinas();
  }, []);

  async function buscarMaquinas() {
    const listaMaquinas = await MaquinaService.listar();
    setMaquinas(listaMaquinas);
  }

  async function excluirMaquina(id) {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja excluir esta máquina?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            await MaquinaService.remover(id);
            buscarMaquinas();
            alert('Máquina excluída com sucesso!');
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }

  function mostrarStatus(status) {
    switch (status) {
      case 'esperando_pecas':
        return 'Esperando Peças';
      case 'manutencao_realizada':
        return 'Manutenção Realizada';
      case 'manutencao_andamento':
        return 'Manutenção em Andamento';
      default:
        return 'Status Desconhecido';
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={maquinas}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <Button
            style={styles.button}
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate('MaquinaForm')}
          >
            Cadastrar
          </Button>
        }
        renderItem={({ item }) => (
          <Card
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: dark ? '#FFFFFF' : '#C7C7C7',
                borderWidth: 1,
              },
            ]}
          >
            <Card.Content>
              <Text style={{ color: colors.text }}>ID: {item.id}</Text>
              <Text style={{ color: colors.text }}>Modelo: {item.modelo}</Text>
              <Text style={{ color: colors.text }}>Marca: {item.marca}</Text>
              <Text style={{ color: colors.text }}>Cliente: {item.cliente}</Text>
              <Text style={{ color: colors.text }}>Técnico: {item.tecnico}</Text>
              <Text style={{ color: colors.text }}>Status: {mostrarStatus(item.status)}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                icon="eye"
                onPress={() => navigation.navigate('MaquinaStatus', { id: item.id })}
                color={colors.text}
              />
              <Button icon="delete" onPress={() => excluirMaquina(item.id)} color={colors.text} />
            </Card.Actions>
          </Card>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    margin: 10,
  },
  card: {
    margin: 10,
    borderRadius: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
