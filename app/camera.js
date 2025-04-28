import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function CameraScreen() {

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  button: {
    backgroundColor: '#3498db',
    width: 170,
    marginHorizontal: 'auto',
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});