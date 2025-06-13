// src/components/QRCodeGen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeGenerator = ({ value }) => {
  return (
    <View style={styles.container}>
      {value ? (
        <QRCode value={value} size={200} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default QRCodeGenerator;
