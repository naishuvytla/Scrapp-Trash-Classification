import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { CameraView as CameraViewType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { classifyImageAsync } from '../api/classifier';

const PRIMARY = '#57CC99';
const SECONDARY = '#38A3A5';

type CameraScreenNavProp = NativeStackNavigationProp<MainStackParamList, 'Camera'>;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewType | null>(null);
  const navigation = useNavigation<CameraScreenNavProp>();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btnWrapper}>
          <LinearGradient
            colors={[PRIMARY, SECONDARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnInner}
          >
            <Text style={styles.btnText}>Grant Permission</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    try {
      setErr(null);
      const shot = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
      if (!shot?.uri) return;

      setLoading(true);
      const clsResult = await classifyImageAsync(shot.uri);

      navigation.navigate('Result', { uri: shot.uri, result: clsResult });
    } catch (e: any) {
      console.error('Error taking/classifying image:', e);
      setErr(e?.message ?? 'Failed to classify image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        {}
        {err && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{err}</Text>
          </View>
        )}
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Classifying…</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btnWrapper} onPress={takePicture} disabled={loading}>
          <LinearGradient
            colors={[PRIMARY, SECONDARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.btnInner, loading && { opacity: 0.7 }]}
          >
            <Text style={styles.btnText}>{loading ? 'Please wait' : 'Take Picture'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  camera: { flex: 1 },

  permissionText: { fontSize: 16, marginBottom: 16, color: '#22577A', fontWeight: '600' },

  banner: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(176, 0, 32, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bannerText: { color: '#fff', fontWeight: '700' },

  loading: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  loadingText: { color: '#fff', fontWeight: '600' },

  btnWrapper: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    borderRadius: 50,
    overflow: 'hidden',
  },
  btnInner: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});