import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Switch, Text } from 'react-native-paper'
import { useTheme } from '../theme/themeContext'

export default function ConfigScreen() {
  const { dark, toggleTheme, colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Modo Escuro</Text>
        <Switch value={dark} onValueChange={toggleTheme} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
})
