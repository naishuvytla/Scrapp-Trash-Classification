import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = (Constants?.expoConfig?.extra as any)?.apiUrl || 'http://127.0.0.1:8000/api/';

const API = axios.create({ baseURL: apiUrl });

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

export default API;