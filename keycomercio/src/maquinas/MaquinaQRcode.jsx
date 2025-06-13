import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import MaquinaService from './MaquinaService';

export default function MaquinaQRCodeScreen({ navigation, route }) {
  const { id } = route.params || {};
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  // Dados usados para criar o QR code
  const qrValue = maquina ? `${maquina.id}` : '';

  if (!qrValue) {
    return (
      <View style={styles.container}>
        <Text>Erro ao gerar QR Code: dados inválidos.</Text>
        <Button onPress={() => navigation.goBack()}>Voltar</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code da Máquina</Text>
      <QRCode value={qrValue} size={250} />
      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Voltar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  button: { marginTop: 20, width: '50%' },
});
