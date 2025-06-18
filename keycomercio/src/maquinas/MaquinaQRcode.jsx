import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme, ActivityIndicator, Card, Divider } from 'react-native-paper';
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
    } catch (error) {
      alert('Ocorreu um erro ao tentar compartilhar: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const qrValue = maquina ? `${maquina.id}` : '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleLarge" style={styles.title}>
            QR Code da Máquina
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            {maquina.modelo}
          </Text>
          <ViewShot ref={viewShotRef} options={{ format: 'png', result: 'base64' }}>
            <View style={styles.qrCodeContainer}>
              <QRCode value={qrValue} size={220} />
            </View>
          </ViewShot>
          <Text variant="bodySmall" style={[styles.instructionText, { color: colors.onSurfaceVariant }]}>
            Aponte a câmera de outro dispositivo para escanear
          </Text>
        </Card.Content>

        <Divider style={{ marginHorizontal: 16 }} />

        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained-tonal"
            onPress={imprimirQRCode}
            icon="printer"
          >
            Imprimir
          </Button>
          <Button
            mode="contained-tonal"
            onPress={compartilharQRCode}
            icon="share-variant"
          >
            Compartilhar
          </Button>
        </Card.Actions>
        <Card.Actions style={{ justifyContent: 'center', paddingBottom: 16 }}>
          <Button onPress={() => navigation.goBack()}>
            Voltar
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 24,
  },
  qrCodeContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  instructionText: {
    marginTop: 24,
  },
  cardActions: {
    justifyContent: 'space-around',
    padding: 16,
    paddingTop: 20,
  },
});