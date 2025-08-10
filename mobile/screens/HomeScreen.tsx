import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }: any) {
  return (
    <LinearGradient
      colors={['#CFF7D4', '#CFEFE9', '#BFE4EA']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome to Scrapp!</Text>
      <Text style={styles.subtitle}>
        Learn how to sustainably dispose your trash.
      </Text>

      <View style={styles.buttonOutline}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Camera')}
          activeOpacity={0.9}
          style={styles.buttonOuter}
        >
          <LinearGradient
            colors={['#57CC99', '#38A3A5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Open Camera</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#57CC99', 
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#22577A',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonOutline: {
    borderRadius: 14,
    padding: 2,
    marginTop: 8,
    width: 200, 
  },
  buttonOuter: { borderRadius: 12, overflow: 'hidden' },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});