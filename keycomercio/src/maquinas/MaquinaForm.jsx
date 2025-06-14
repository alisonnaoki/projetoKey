import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Button, Text, TextInput, useTheme } from 'react-native-paper'; // Importando o hook do tema do Paper
import { Picker } from '@react-native-picker/picker';
import MaquinaService from './MaquinaService';

export default function MaquinaForm({ navigation, route }) {
  const maquinaAntiga = route.params || {};
  const { colors } = useTheme(); // Obtendo as cores do tema do Paper

  const [modelo, setModelo] = useState(maquinaAntiga.modelo || '');
  const [marca, setMarca] = useState(maquinaAntiga.marca || '');
  const [tecnico, setTecnico] = useState(maquinaAntiga.tecnico || '');
  const [dataEntrada, setDataEntrada] = useState(maquinaAntiga.dataEntrada || '');
  const [status, setStatus] = useState(maquinaAntiga.status || '');
  const [descricaoProblema, setDescricaoProblema] = useState(maquinaAntiga.descricaoProblema || '');
  const [solucaoAplicada, setSolucaoAplicada] = useState(maquinaAntiga.solucaoAplicada || '');
  const [cliente, setCliente] = useState(maquinaAntiga.cliente || '');

  async function salvar() {
    const maquina = {
      modelo,
      marca,
      tecnico,
      dataEntrada,
      status,
      descricaoProblema,
      solucaoAplicada,
      cliente,
    };

    if (
      !maquina.modelo ||
      !maquina.marca ||
      !maquina.tecnico ||
      !maquina.dataEntrada ||
      !maquina.status ||
      !maquina.descricaoProblema ||
      !maquina.cliente
    ) {
      alert('Preencha todos os campos obrigatórios!!!');
      return;
    }

    if (maquinaAntiga.id) {
      maquina.id = maquinaAntiga.id;
      await MaquinaService.atualizar(maquina);
      alert('Máquina atualizada com sucesso!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MaquinaListaScreen' }],
      });
    } else {
      await MaquinaService.salvar(maquina);
      alert('Máquina criada com sucesso!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MaquinaListaScreen' }],
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <Text variant="titleLarge" style={{ marginTop: 10 }}>
            Informe os dados:
          </Text>
          <Text variant="titleLarge" style={{ marginTop: 10 }}>
            Máquina ID: {maquinaAntiga.id || 'NOVO'}
          </Text>

          <TextInput
            label="Cliente"
            style={styles.input}
            mode="outlined"
            value={cliente}
            onChangeText={setCliente}
            theme={{ colors: { primary: colors.primary } }} // Usando a cor primária do tema
          />

          <TextInput
            label="Modelo"
            style={styles.input}
            mode="outlined"
            value={modelo}
            onChangeText={setModelo}
            theme={{ colors: { primary: colors.primary } }} // Usando a cor primária do tema
          />

          <TextInput
            label="Marca"
            style={styles.input}
            mode="outlined"
            value={marca}
            onChangeText={setMarca}
            theme={{ colors: { primary: colors.primary } }} // Usando a cor primária do tema
          />

          <TextInput
            label="Técnico Responsável"
            style={styles.input}
            mode="outlined"
            value={tecnico}
            onChangeText={setTecnico}
            theme={{ colors: { primary: colors.primary } }} // Usando a cor primária do tema
          />

          <TextInput
            label="Data de Entrada"
            style={styles.input}
            mode="outlined"
            value={dataEntrada}
            onChangeText={setDataEntrada}
            keyboardType="numeric"
            placeholder="DD/MM/YYYY"
            render={(props) => (
              <TextInputMask
                {...props}
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY',
                }}
              />
            )}
            theme={{ colors: { primary: colors.primary } }} // Usando a cor primária do tema
          />

          <View
            style={[
              styles.input,
              { borderWidth: 1, borderRadius: 4, borderColor: '#C7C7C7' },
            ]}
          >
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Selecionar Status" value="" />
              <Picker.Item label="Esperando Peças" value="esperando_pecas" />
              <Picker.Item label="Manutenção Realizada" value="manutencao_realizada" />
              <Picker.Item
                label="Manutenção em Andamento"
                value="manutencao_andamento"
              />
            </Picker>
          </View>

          <TextInput
            label="Descrição do Problema"
            style={styles.input}
            mode="outlined"
            value={descricaoProblema}
            onChangeText={setDescricaoProblema}
            multiline
            theme={{ colors: { primary: colors.primary } }} // Usando a cor primária do tema
          />

          <TextInput
            label="Solução Aplicada"
            style={[styles.input, styles.solucaoInput]}
            mode="outlined"
            value={solucaoAplicada}
            onChangeText={setSolucaoAplicada}
            multiline
            theme={{ colors: { primary: colors.primary } }} // Usando a cor primária do tema
          />

          <Button style={styles.input} mode="contained" icon="plus" onPress={salvar}>
            Salvar
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    width: '90%',
    marginTop: 10,
  },
  solucaoInput: {
    height: 150, 
    textAlignVertical: 'top', 
  },
});
