import React from 'react';
import {
  Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, type DimensionValue,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { useHeaderHeight } from '@react-navigation/elements';

const PRIMARY = '#57CC99';
const SECONDARY = '#38A3A5';

const DISPOSAL_COLORS: Record<string, string> = {
  cardboard: '#A67C52',
  glass: '#6EC4A7',
  metal: '#8C8C8C',
  paper: '#6AAAE8',
  plastic: '#F2A541',
  trash: '#444444',
  unsure: '#9A9A9A',
};

type ResultRouteProp = RouteProp<MainStackParamList, 'Result'>;
type NavProp = NativeStackNavigationProp<MainStackParamList, 'Result'>;

export default function ResultScreen() {
  const route = useRoute<ResultRouteProp>();
  const navigation = useNavigation<NavProp>();
  const headerHeight = useHeaderHeight();
  const { uri, result } = route.params;

  const retake = () => navigation.replace('Camera');
  const goHome = () => navigation.navigate('Tabs');
  const openChat = () =>
    navigation.navigate('DisposalChat', {
      label: result.label,
      instructions: result.instructions,
    });

  const color = DISPOSAL_COLORS[result?.label ?? 'unsure'];

  return (
    <LinearGradient
      colors={['#CFF7D4', '#CFEFE9', '#BFE4EA']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: headerHeight + 8 }]}
      >
        <Image source={{ uri }} style={styles.preview} resizeMode="cover" />

        <View style={[styles.infoBlock, { borderColor: color }]}>
          <Text style={[styles.title, { color }]}>
            {result.label.toUpperCase()}
            {typeof result.confidence === 'number'
              ? `  •  ${(result.confidence * 100).toFixed(1)}%`
              : ''}
          </Text>

          {!!result.instructions && (
            <Text style={styles.instructions}>{result.instructions}</Text>
          )}

          {!!result.probs && (
            <View style={styles.probs}>
              <Text style={styles.probsTitle}>Model probabilities</Text>
              {Object.entries(result.probs)
                .sort((a, b) => b[1] - a[1])
                .map(([k, v]) => {
                  const pctNum = Math.round(v * 100);
                  const widthPct = `${pctNum}%` as DimensionValue;
                  return (
                    <View key={k} style={styles.probRow}>
                      <Text style={styles.probLabel}>{k}</Text>
                      <View style={styles.barBg}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: widthPct,
                              backgroundColor: DISPOSAL_COLORS[k] ?? PRIMARY,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.probPct}>{pctNum}%</Text>
                    </View>
                  );
                })}
            </View>
          )}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={retake} activeOpacity={0.9} style={styles.btnWrapper}>
            <LinearGradient
              colors={[PRIMARY, SECONDARY]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnInner}
            >
              <Text style={styles.btnText}>Retake</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={openChat} activeOpacity={0.9} style={styles.btnWrapper}>
            <LinearGradient
              colors={[PRIMARY, SECONDARY]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnInner}
            >
              <Text style={styles.btnText}>Ask about disposal</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={goHome} activeOpacity={0.9} style={styles.btnWrapper}>
            <LinearGradient
              colors={[PRIMARY, SECONDARY]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnInner}
            >
              <Text style={styles.btnText}>Back to Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16, paddingBottom: 32 },
  preview: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    backgroundColor: '#EEF2F1',
    borderWidth: 1,
    borderColor: '#DDE7E5',
  },
  infoBlock: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  instructions: { fontSize: 15, lineHeight: 21, color: '#374151' },
  probs: { marginTop: 14 },
  probsTitle: { fontWeight: '700', marginBottom: 6, color: '#111827' },
  probRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  probLabel: { width: 84, textTransform: 'capitalize', color: '#111827' },
  barBg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB' },
  barFill: { height: 8, borderRadius: 4 },
  probPct: { width: 45, textAlign: 'right', color: '#111827' },

  actionsWrap: {
    marginTop: 12,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  actionsGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10, 
  },
  btnWrapper: {
    flex: 1, 
  },
  btnInner: {
    height: 54, 
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
});