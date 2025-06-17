import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
import { Button, Card, Text, useTheme, Portal, Dialog, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// 1. Importe o LottieView
import LottieView from 'lottie-react-native';
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
      buscarMaquinas();
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'manutencao_realizada':
        return { icon: 'check-circle', color: colors.tertiary };
      case 'manutencao_andamento':
        return { icon: 'progress-wrench', color: colors.primary };
      case 'esperando_pecas':
        return { icon: 'alert-circle', color: colors.error };
      default:
        return { icon: 'help-circle', color: colors.onSurfaceDisabled };
    }
  };

  if (loading && !refreshing) {
    return (
      // 2. Tela de loading agora usa a animação Lottie
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <LottieView
          source={require('../../assets/gear-avatar.json')} // Certifique-se que o nome do arquivo está correto
          style={{ width: 200, height: 200 }}
          autoPlay
          loop
        />
        <Text variant="bodyLarge" style={{ marginTop: 20, color: colors.text }}>Carregando máquinas...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title
          title={item.modelo}
          titleVariant="titleLarge"
          subtitle={item.marca}
          subtitleVariant="bodyMedium"
          // 3. A animação é adicionada aqui, na prop 'left'
          left={(props) => (
            <View style={styles.avatarContainer}>
              <LottieView
                {...props}
                source={require('../../assets/gear-avatar.json')} // Certifique-se que o nome do arquivo está correto
                autoPlay
                loop
                style={{ width: 50, height: 50 }}
              />
            </View>
          )}
        />
        <Card.Content style={styles.cardContent}>
          <Chip
            icon={statusStyle.icon}
            selectedColor={statusStyle.color}
            style={[styles.statusChip, { backgroundColor: colors.surfaceVariant }]}
            textStyle={{ color: statusStyle.color }}
          >
            {mostrarStatus(item.status)}
          </Chip>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-circle-outline" size={16} color={colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={styles.infoText}>Cliente: {item.cliente}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-hard-hat" size={16} color={colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={styles.infoText}>Técnico: {item.tecnico}</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            icon="eye"
            onPress={() => navigation.navigate('MaquinaStatus', { id: item.id })}
          >
            Ver Detalhes
          </Button>
          <Button
            icon="delete-outline"
            onPress={() => showDialog(item.id)}
            textColor={colors.error}
          >
            Excluir
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
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
            <Text variant="bodyLarge" style={{color: colors.text}}>Nenhuma máquina encontrada.</Text>
            <Text variant="bodyMedium" style={{color: colors.onSurfaceVariant}}>Cadastre a primeira!</Text>
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
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog} style={{backgroundColor: colors.surface}}>
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
    margin: 16,
    marginTop: 20,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  avatarContainer: {
    width: 40,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    marginLeft: 0,
  },
  cardContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 12, 
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});