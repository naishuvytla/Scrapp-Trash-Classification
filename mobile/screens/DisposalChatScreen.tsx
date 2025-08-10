import React, { useMemo, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

import type { MainStackParamList } from '../navigation/MainStack';
import { sendDisposalChat, type ChatTurn } from '../api/disposalChat';

type RouteP = RouteProp<MainStackParamList, 'DisposalChat'>;
type NavP = NativeStackNavigationProp<MainStackParamList, 'DisposalChat'>;

const PRIMARY = '#57CC99';
const SECONDARY = '#22577A';

export default function DisposalChatScreen() {
  const route = useRoute<RouteP>();
  const navigation = useNavigation<NavP>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const label = route.params?.label;
  const instructions = route.params?.instructions;

  const itemName = (label ?? 'this item');
  const initialGreeting: ChatTurn = {
    role: 'assistant',
    content: `Ask me anything about disposing ${itemName} responsibly.`,
  };

  const [history, setHistory] = useState<ChatTurn[]>([initialGreeting]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const ctx = useMemo(() => ({ label, instructions }), [label, instructions]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput('');
    const next: ChatTurn[] = [...history, { role: 'user', content: msg }];
    setHistory(next);
    setLoading(true);
    try {
      const { reply } = await sendDisposalChat(msg, ctx, next);
      setHistory((h) => [...h, { role: 'assistant', content: reply ?? '(no reply)' }]);
    } catch (e: any) {
      setHistory((h) => [...h, { role: 'assistant', content: `Sorry—error: ${e.message}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }
  };

  const keyboardOffset = Platform.OS === 'ios' ? Math.max(0, headerHeight - 8) : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardOffset}
    >
      <LinearGradient colors={['#EAF8EF', '#E8F1F4']} style={{ flex: 1 }}>
        <View style={[styles.header, { paddingTop: Math.max(16, insets.top + 12) }]}>
          <Text style={styles.h1}>Ask about disposal</Text>
          {label ? <Text style={styles.h2}>Item: {label.toUpperCase()}</Text> : null}
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.chatWrap,
            { paddingBottom: (insets.bottom || 16) + 96 },
          ]}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {history.map((t, i) => (
            <View key={i} style={[styles.bubble, t.role === 'user' ? styles.me : styles.bot]}>
              <Text style={styles.msg}>{t.content}</Text>
            </View>
          ))}
          {loading && <Text style={{ alignSelf: 'center', margin: 8, color: '#4B5563' }}>Thinking…</Text>}
        </ScrollView>

        {}
        <View
          style={[
            styles.inputRow,
            {
              paddingBottom: (insets.bottom || 8) + 8, 
            },
          ]}
        >
          <TextInput
            placeholder="Ask about cleaning, local rules, special cases…"
            value={input}
            onChangeText={setInput}
            style={styles.input}
            editable={!loading}
            returnKeyType="send"
            onSubmitEditing={send}
            onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)}
          />
          <TouchableOpacity onPress={send} disabled={loading} style={styles.sendBtn}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{loading ? '…' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: 8, paddingHorizontal: 14 },
  h1: { fontSize: 20, fontWeight: '800', color: SECONDARY },
  h2: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 4 },

  chatWrap: { paddingHorizontal: 12, gap: 8 },
  bubble: { maxWidth: '82%', padding: 10, borderRadius: 12 },
  me: { alignSelf: 'flex-end', backgroundColor: '#DCFCE7' },
  bot: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  msg: { fontSize: 15, color: '#111827' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    paddingHorizontal: 12,
    backgroundColor: '#EAF8EF', 
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DDE7E5',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    height: 44,
    minWidth: 70,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});