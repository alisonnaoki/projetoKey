import { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
// 1. Importe Portal e Dialog do Paper
import { Button, Card, Text, useTheme, ActivityIndicator, Portal, Dialog } from 'react-native-paper'; 
import MaquinaService from '../maquinas/MaquinaService';
import { useFocusEffect } from '@react-navigation/native';

export default function MaquinaListaScreen({ navigation }) {
  const { colors } = useTheme();

  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [maquinaParaExcluir, setMaquinaParaExcluir] = useState(null);

  useFocusEffect(
    useCallback(() => {
      buscarMaquinas();
    }, [])
  );

  async function buscarMaquinas() {
    setLoading(true);
    const listaMaquinas = await MaquinaService.listar();
    setMaquinas(listaMaquinas);
    setLoading(false);
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await buscarMaquinas();
    setRefreshing(false);
  }, []);

 
  const showDialog = (id) => {
    setMaquinaParaExcluir(id);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setMaquinaParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (maquinaParaExcluir) {
      await MaquinaService.remover(maquinaParaExcluir);
      buscarMaquinas(); // Atualiza a lista
    }
    hideDialog();
  };


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

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator animating={true} size="large" color={colors.primary} />
      </View>
    );
  }
  
  const renderItem = ({ item }) => (
    <Card style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
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
          textColor={colors.primary}
        />
        {/* 4. O botão de excluir agora chama a função para mostrar o Dialog */}
        <Button
          icon="delete"
          onPress={() => showDialog(item.id)}
          textColor={colors.error}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        // ... (resto das props da FlatList, sem alteração)
        data={maquinas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Button
            style={styles.button}
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate('MaquinaForm')}
          >
            Cadastrar Nova Máquina
          </Button>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.text }}>Nenhuma máquina encontrada.</Text>
            <Text style={{ color: colors.text }}>Cadastre a primeira!</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
      {/* 5. Adicionamos o Portal com o Dialog aqui. Ele fica invisível até ser ativado */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Confirmação de Exclusão</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Você tem certeza que deseja excluir esta máquina? Esta ação não pode ser desfeita.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={confirmarExclusao} textColor={colors.error}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      margin: 10,
    },
    card: {
      margin: 10,
      borderRadius: 8,
      borderWidth: 1, // Borda sutil
    },
    listContainer: {
      paddingBottom: 20,
    },
    emptyContainer: {
      marginTop: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });