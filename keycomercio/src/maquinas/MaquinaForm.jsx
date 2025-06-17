import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Button, Text, TextInput, useTheme, Card, Menu, Divider } from 'react-native-paper';
import MaquinaService from './MaquinaService';

export default function MaquinaForm({ navigation, route }) {
  const maquinaAntiga = route.params || {};
  const { colors } = useTheme();

  const [modelo, setModelo] = useState(maquinaAntiga.modelo || '');
  const [marca, setMarca] = useState(maquinaAntiga.marca || '');
  const [tecnico, setTecnico] = useState(maquinaAntiga.tecnico || '');
  const [dataEntrada, setDataEntrada] = useState(maquinaAntiga.dataEntrada || '');
  const [status, setStatus] = useState(maquinaAntiga.status || '');
  const [descricaoProblema, setDescricaoProblema] = useState(maquinaAntiga.descricaoProblema || '');
  const [solucaoAplicada, setSolucaoAplicada] = useState(maquinaAntiga.solucaoAplicada || '');
  const [cliente, setCliente] = useState(maquinaAntiga.cliente || '');

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const statusOptions = {
    '': 'Selecionar Status',
    'esperando_pecas': 'Esperando Peças',
    'manutencao_realizada': 'Manutenção Realizada',
    'manutencao_andamento': 'Manutenção em Andamento',
  };

  async function salvar() {
    const maquina = {
      modelo, marca, tecnico, dataEntrada, status, descricaoProblema, solucaoAplicada, cliente,
    };
    if (!maquina.modelo || !maquina.marca || !maquina.tecnico || !maquina.dataEntrada || !maquina.status || !maquina.descricaoProblema || !maquina.cliente) {
      alert('Preencha todos os campos obrigatórios!!!');
      return;
    }
    if (maquinaAntiga.id) {
      maquina.id = maquinaAntiga.id;
      await MaquinaService.atualizar(maquina);
      navigation.reset({ index: 0, routes: [{ name: 'MaquinaListaScreen', params: { feedbackMessage: 'Máquina atualizada com sucesso!' } }] });
    } else {
      await MaquinaService.salvar(maquina);
      navigation.reset({ index: 0, routes: [{ name: 'MaquinaListaScreen', params: { feedbackMessage: 'Máquina criada com sucesso!' } }] });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      enabled
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.headerText}>
              {maquinaAntiga.id ? 'Editar Máquina' : 'Cadastrar Nova Máquina'}
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
              Máquina ID: {maquinaAntiga.id || 'NOVO'}
            </Text>
            <Divider style={styles.divider} />
            <TextInput label="Cliente" style={styles.input} mode="outlined" value={cliente} onChangeText={setCliente} left={<TextInput.Icon icon="account-circle" />} />
            <TextInput label="Modelo" style={styles.input} mode="outlined" value={modelo} onChangeText={setModelo} left={<TextInput.Icon icon="tag-text" />} />
            <TextInput label="Marca" style={styles.input} mode="outlined" value={marca} onChangeText={setMarca} left={<TextInput.Icon icon="cog-outline" />} />
            <TextInput label="Técnico Responsável" style={styles.input} mode="outlined" value={tecnico} onChangeText={setTecnico} left={<TextInput.Icon icon="account-hard-hat" />} />
            <TextInput
              label="Data de Entrada"
              style={styles.input}
              mode="outlined"
              value={dataEntrada}
              onChangeText={setDataEntrada}
              keyboardType="numeric"
              render={(props) => (<TextInputMask {...props} type={'datetime'} options={{ format: 'DD/MM/YYYY' }} />)}
              left={<TextInput.Icon icon="calendar-month" />}
            />
            <Divider style={styles.divider} />
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu} style={styles.pickerContainer}>
                  <TextInput
                    label="Status"
                    value={statusOptions[status]}
                    mode="outlined"
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                  />
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => { setStatus('esperando_pecas'); closeMenu(); }} title="Esperando Peças" />
              <Menu.Item onPress={() => { setStatus('manutencao_realizada'); closeMenu(); }} title="Manutenção Realizada" />
              <Menu.Item onPress={() => { setStatus('manutencao_andamento'); closeMenu(); }} title="Manutenção em Andamento" />
            </Menu>
            <TextInput label="Descrição do Problema" style={styles.input} mode="outlined" value={descricaoProblema} onChangeText={setDescricaoProblema} multiline left={<TextInput.Icon icon="alert-decagram" />} />
            <TextInput label="Solução Aplicada" style={styles.input} mode="outlined" value={solucaoAplicada} onChangeText={setSolucaoAplicada} multiline numberOfLines={4} left={<TextInput.Icon icon="check-decagram" />} />
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button onPress={() => navigation.goBack()}>Cancelar</Button>
            <Button mode="contained" icon="content-save" onPress={salvar}>
              Salvar
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 16, 
    paddingBottom: 200,
  },
  card: {
    marginHorizontal: 16, 
    borderRadius: 12,
    elevation: 4,
  },
  headerText: {
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  input: {
    marginHorizontal: 16, 
    marginTop: 8,
  },
  pickerContainer: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  cardActions: {
    justifyContent: 'flex-end',
    padding: 16,
    gap: 8,
  },
});