import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper'; // Importando o hook do tema do Paper
import MaquinaService from './MaquinaService';

export default function MaquinaStatus({ navigation, route }) {
  const { id } = route.params || {};
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme(); // Obtendo as cores do tema do Paper

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
        navigation.navigate('MaquinaListaScreen');
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando informações da máquina...</Text>
      </View>
    );
  }

  const formatarStatus = (status) => {
    switch (status) {
      case 'esperando_pecas':
        return 'Esperando Peças';
      case 'manutencao_realizada':
        return 'Manutenção Realizada';
      case 'manutencao_andamento':
        return 'Manutenção em Andamento';
      default:
        return status;
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Card
        style={[
          styles.card,
          { backgroundColor: colors.surface },
          { borderColor: colors.text, borderWidth: 1 }, // Borda do card
        ]}
      >
        <Card.Title title={`Máquina: ${maquina.modelo} (${maquina.marca})`} />
        <Card.Content>
          <Text style={[styles.label, { color: colors.text }]}>Cliente:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{maquina.cliente}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Técnico Responsável:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{maquina.tecnico}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Data de Entrada:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{maquina.dataEntrada}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Status:</Text>
          <Text style={[styles.value, styles.status]}>{formatarStatus(maquina.status)}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Descrição do Problema:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{maquina.descricaoProblema}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Solução Aplicada:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{maquina.solucaoAplicada}</Text>

          {/* Botão para gerar QR Code */}
          <Button
            mode="contained"
            onPress={() => navigation.navigate('MaquinaQRCode', { id: maquina.id })}
            style={{ marginVertical: 10 }}
          >
            Gerar QR Code
          </Button>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            icon="pencil"
            onPress={() => navigation.navigate('MaquinaForm', maquina)}
          >
            Editar
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('MaquinaListaScreen')}>
            Voltar
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
  card: {
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  status: {
    color: '#007AFF', // Você pode ajustar isso para usar cores do tema se preferir
  },
});
