import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import MaquinaService from './MaquinaService';

export default function MaquinaStatus({ navigation, route }) {
  const { id } = route.params || {};
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ID recebido:', id);
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
        navigation.goBack();
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


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={`Máquina: ${maquina.modelo} (${maquina.marca})`} />
        <Card.Content>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{maquina.cliente}</Text>
          <Text style={styles.label}>Técnico Responsável:</Text>
          <Text style={styles.value}>{maquina.tecnico}</Text>
          <Text style={styles.label}>Data de Entrada:</Text>
          <Text style={styles.value}>{maquina.dataEntrada}</Text>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, styles.status]}>
            {maquina.status}
          </Text>
          <Text style={styles.label}>Descrição do Problema:</Text>
          <Text style={styles.value}>{maquina.descricaoProblema}</Text>
          <Text style={styles.label}>Solução Aplicada:</Text>
          <Text style={styles.value}>{maquina.solucaoAplicada}</Text>

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
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  card: {
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  status: {
    color: '#007AFF',
  },
});
