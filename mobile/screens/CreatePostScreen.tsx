import React, { useState } from 'react';
import {
  View, Text, TextInput, Alert, TouchableOpacity, Modal, FlatList, StyleSheet, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';
import { CATEGORIES, type CategorySlug } from '../constants/categories';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from '@react-navigation/elements';

const PRIMARY = '#57CC99';
const SECONDARY = '#22577A';

export default function CreatePostScreen({ navigation }: any) {
  const headerHeight = useHeaderHeight();        
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategorySlug | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      Alert.alert('Please fill in title, content, and select a category.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) { navigation.navigate('Login'); return; }
      await API.post('posts/', { title, content, category }, { headers: { Authorization: `Token ${token}` } });
      Alert.alert('Post created successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error creating post');
      console.error(error);
    }
  };

  const selectedLabel = category
    ? CATEGORIES.find(c => c.slug === category)?.label
    : 'Select a category';

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight + 8 }]}>
      <Text style={styles.title}>Create a New Post</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Content</Text>
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.contentInput]}
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <TouchableOpacity style={styles.select} onPress={() => setPickerOpen(true)}>
        <Text style={styles.selectText}>{selectedLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} style={styles.primaryBtn} activeOpacity={0.9}>
        <LinearGradient
          colors={[PRIMARY, '#38A3A5']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.primaryBtnInner}
        >
          <Text style={styles.primaryBtnText}>Create Post</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose a category</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item.slug}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => { setCategory(item.slug); setPickerOpen(false); }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
            />
            <TouchableOpacity style={styles.modalCancel} onPress={() => setPickerOpen(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '800', color: PRIMARY, textAlign: 'center', marginBottom: 20 },
  label: { fontWeight: '600', marginTop: 10, marginBottom: 4, color: SECONDARY },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, backgroundColor: '#fff',
  },
  contentInput: { height: 150, textAlignVertical: 'top' },
  select: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff', marginBottom: 12,
  },
  selectText: { color: '#333' },
  primaryBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 16 },
  primaryBtnInner: { borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, maxHeight: '70%', width: '100%' },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: SECONDARY },
  modalItem: { paddingVertical: 12 },
  modalItemText: { fontSize: 16 },
  sep: { height: 1, backgroundColor: '#eee' },
  modalCancel: { marginTop: 12, alignSelf: 'flex-end' },
  modalCancelText: { color: PRIMARY, fontWeight: '600' },
});