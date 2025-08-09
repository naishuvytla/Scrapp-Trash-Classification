import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function CommunityScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('authToken');
      if (!savedToken) return;

      const response = await API.get('posts/', {
        headers: {
          Authorization: `Token ${savedToken}`,
        },
      });

      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching posts:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Blog Feed</Text>

      <Button title="Create New Post" onPress={() => navigation.navigate('CreatePost')} />
      <Button title="Logout" onPress={logout} />

      {loading ? (
        <Text>Loading posts...</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text>{item.content}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  post: { marginBottom: 20, padding: 10, borderWidth: 1, borderRadius: 5 },
  postTitle: { fontSize: 18, fontWeight: '600' },
});