import AsyncStorage from '@react-native-async-storage/async-storage';

async function listar() {
  const jsonValue = await AsyncStorage.getItem('@maquinas');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(maquina) {
  maquina.id = new Date().getTime();
  const maquinas = await listar();
  maquinas.push(maquina);
  await AsyncStorage.setItem('@maquinas', JSON.stringify(maquinas));
}

async function buscar(id) {
  const maquinas = await listar();
  return maquinas.find(maquina => {
    return String(maquina.id) === String(id); // Converte ambos para string para comparação
  });
}

async function remover(id) {
  const maquinas = await listar();
  const novaLista = maquinas.filter(maquina => maquina.id !== id);
  await AsyncStorage.setItem('@maquinas', JSON.stringify(novaLista));
}

async function atualizar(novaMaquina) {
  const maquinas = await listar();
  const novaLista = maquinas.map(maquina => maquina.id === novaMaquina.id ? novaMaquina : maquina);
  await AsyncStorage.setItem('@maquinas', JSON.stringify(novaLista));
}

export default {
  listar,
  salvar,
  buscar,
  atualizar,
  remover
}
