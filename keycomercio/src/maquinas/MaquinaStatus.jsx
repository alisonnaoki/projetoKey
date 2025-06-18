import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Card, Text, useTheme, ActivityIndicator, Divider, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import MaquinaService from './MaquinaService';

const DetailRow = ({ icon, label, value, colors }) => (
  <View style={styles.detailRow}>
    <MaterialCommunityIcons name={icon} size={24} color={colors.primary} style={styles.detailIcon} />
    <View style={styles.detailTextContainer}>
      <Text variant="labelLarge" style={{ color: colors.onSurfaceVariant }}>{label}</Text>
      <Text variant="bodyLarge" style={{ color: colors.text, flexShrink: 1 }}>{value || 'Não informado'}</Text>
    </View>
  </View>
);

export default function MaquinaStatus({ navigation, route }) {
  const { id } = route.params || {};
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    async function carregarMaquina() {
      if (!id) {
        alert('ID da máquina não fornecido');
        navigation.goBack();
        return;
      }
      setLoading(true);
      const m = await MaquinaService.buscar(id);
      if (!m) {
        alert('Máquina não encontrada');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MaquinaListaScreen' }],
        });
        return;
      }
      setMaquina(m);
      setLoading(false);
    }
    carregarMaquina();
  }, [id]);

  const formatarStatus = (status) => {
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
  };

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

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator animating={true} size="large" color={colors.primary} />
      </View>
    );
  }

  const statusStyle = getStatusStyle(maquina.status);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title
          title={maquina.modelo}
          subtitle={maquina.marca}
          titleVariant="headlineSmall"
          left={(props) => (
            <View style={styles.avatarContainer}>
              <LottieView
                {...props}
                source={require('../../assets/mecanico-key.json')} 
                autoPlay
                loop
                style={{ width: 60, height: 60 }}
              />
            </View>
          )}
        />
        <Card.Content>
          <Chip
            icon={statusStyle.icon}
            selectedColor={statusStyle.color}
            style={[styles.statusChip, { backgroundColor: colors.surfaceVariant }]}
            textStyle={{ color: statusStyle.color }}
          >
            {formatarStatus(maquina.status)}
          </Chip>

          <Divider style={styles.divider} />

          <DetailRow icon="account-circle" label="Cliente" value={maquina.cliente} colors={colors} />
          <DetailRow icon="account-hard-hat" label="Técnico Responsável" value={maquina.tecnico} colors={colors} />
          <DetailRow icon="calendar-month" label="Data de Entrada" value={maquina.dataEntrada} colors={colors} />

          <Divider style={styles.divider} />

          <DetailRow icon="alert-decagram" label="Descrição do Problema" value={maquina.descricaoProblema} colors={colors} />
          <DetailRow icon="check-decagram" label="Solução Aplicada" value={maquina.solucaoAplicada} colors={colors} />
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained-tonal"
            icon="qrcode-scan"
            onPress={() => navigation.navigate('MaquinaQRCode', { id: maquina.id })}
          >
            QR Code
          </Button>
          <Button
            mode="contained-tonal"
            icon="pencil"
            onPress={() => navigation.navigate('MaquinaForm', maquina)}
          >
            Editar
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 25,
    overflow: 'hidden',
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  detailIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  detailTextContainer: {
    flex: 1,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 8,
  },
});