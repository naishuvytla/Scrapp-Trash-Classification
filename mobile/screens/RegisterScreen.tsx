import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      setMessage('');
      const res = await API.post('users/register/', { username, email, password });
      const token = res.data?.token;

      if (token) {
        await AsyncStorage.setItem('authToken', token);
        login(token);
      } else {
        setMessage('Registration succeeded but no token received. Please log in.');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      setMessage(
        'Registration failed. ' +
        (error?.response?.data?.detail || error?.response?.data?.non_field_errors || '')
      );
      console.log('Register error:', error?.response?.data || error?.message);
    }
  };

  return (
    <LinearGradient
      colors={['#CFF7D4', '#CFEFE9', '#BFE4EA']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.bg}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.center}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.subRow}>
            <Text style={styles.subText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Log In</Text>
            </TouchableOpacity>
          </View>

          {}
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#95A1AD"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
              returnKeyType="next"
            />
          </View>

          {}
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#95A1AD"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              returnKeyType="next"
            />
          </View>

          {}
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#95A1AD"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              style={[styles.input, { paddingRight: 44 }]}
            />
            <TouchableOpacity
              onPress={() => setShowPw((s) => !s)}
              style={styles.eyeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name={showPw ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#8AA0B3"
              />
            </TouchableOpacity>
          </View>

          {message ? <Text style={styles.error}>{message}</Text> : null}

          {}
          <View style={styles.buttonOutline}>
            <TouchableOpacity onPress={handleRegister} activeOpacity={0.9} style={styles.buttonOuter}>
              <LinearGradient
                colors={['#34D399', '#10B981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  subRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  subText: { color: '#6B7280' },
  link: { color: '#2563EB', fontWeight: '600' },

  inputWrap: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  input: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#0F172A' },
  eyeBtn: { position: 'absolute', right: 12, top: 12 },

  error: { color: '#DC2626', marginBottom: 8, textAlign: 'center' },

  buttonOutline: { borderRadius: 14, padding: 2, marginTop: 8 },
  buttonOuter: { borderRadius: 12, overflow: 'hidden' },
  button: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});