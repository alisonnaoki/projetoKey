import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import MaquinaService from './MaquinaService';

export default function MaquinaQRCodeScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { id } = route.params || {};
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);

  const viewShotRef = useRef();

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

const imprimirQRCode = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      const qrCodeTamanho = '35%'; 

      const htmlContent = `
        <html>
          <body style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center; height: 100%; font-size: 16px;">
            <h1 style="margin-top: 20px;">QR Code da Máquina: ${maquina.modelo}</h1>
            <div style="width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px;">
              <img src="data:image/png;base64,${uri}" style="width: ${qrCodeTamanho}; height: auto; max-width: 300px; max-height: 300px;" />
            </div>
            <p style="margin-top: 20px; font-size: 12px;">Este QR Code pode ser escaneado para acessar informações da máquina.</p>
          </body>
        </html>
      `;

      await Print.printAsync({
        html: htmlContent,
      });

    } catch (error) {
      alert('Ocorreu um erro ao tentar imprimir: ' + error.message);
    }
  };
  const compartilharQRCode = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Compartilhamento não está disponível neste dispositivo.');
      return;
    }

    try {

      const base64Image = await viewShotRef.current.capture();


      const path = FileSystem.documentDirectory + 'qrcode.png';

      await FileSystem.writeAsStringAsync(path, base64Image, {
        encoding: FileSystem.EncodingType.Base64,
      });
      

      await Sharing.shareAsync(path, {
        mimeType: 'image/png',
        dialogTitle: 'Compartilhar QR Code',
      });

    } catch(error) {
      alert('Ocorreu um erro ao tentar compartilhar: ' + error.message);
    }
  };


  if (loading) {
    return (
        <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
          <ActivityIndicator size="large" />
        </View>
      );
  }

  const qrValue = maquina ? `${maquina.id}` : '';

  if (!qrValue) {

  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>QR Code da Máquina</Text>
      
      <ViewShot ref={viewShotRef} options={{ format: 'png', result: 'base64' }}>
        <View style={{ padding: 20, backgroundColor: 'white' }}>
            <QRCode value={qrValue} size={250} />
        </View>
      </ViewShot>

      <Button mode="contained" onPress={imprimirQRCode} style={styles.button} icon="printer">
        Imprimir
      </Button>
      <Button mode="outlined" onPress={compartilharQRCode} style={styles.button} icon="share-variant">
        Compartilhar
      </Button>
      <Button onPress={() => navigation.goBack()} style={styles.button}>
        Voltar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  button: { marginTop: 15, width: '60%' },
});