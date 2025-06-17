import { Camera, useCameraPermissions, CameraView } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

type Prop = {
  type: string;
  data: string;
};

export default function QRCodeScanner({ navigation, route }) {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        alert('Desculpe, precisamos da permissão da câmera para fazer isso funcionar!');
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: Prop) => {
    setScanned(true);
    console.log('código escaneado', data);
    const maquinaId = data;
    console.log('ID da máquina:', maquinaId);

    navigation.navigate('MaquinaStack', {
      screen: 'MaquinaStatus',
      params: { id: maquinaId },
    });

    Alert.alert(
      `Código ${type} Escaneado`,
      `ID: ${data}`,
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };

  if (!permission?.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.permissionText, { color: colors.text }]}>Permissão da câmera não concedida.</Text>
        <Button mode="contained" onPress={requestPermission}>
          Solicitar Permissão
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.resetButtonContainer, { backgroundColor: colors.background }]}>
        <Button
          mode="outlined"
          icon="refresh"
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'QRCodeScanner' }],
          })}
          style={styles.resetButton}
          textColor={colors.primary}
        >
          Ler QR code
        </Button>
      </View>

      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.layerContainer}>
          <View style={styles.layerTop} />
          <View style={styles.layerCenter}>
            <View style={styles.layerLeft} />
            <View style={styles.focused} />
            <View style={styles.layerRight} />
          </View>
          <View style={styles.layerBottom} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  layerContainer: {
    flex: 1,
  },
  layerTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  layerCenter: {
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  focused: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#00FF00',
  },
  layerRight: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  layerBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  resetButtonContainer: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
})