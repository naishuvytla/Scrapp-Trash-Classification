import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { CATEGORIES, type CategorySlug } from '../constants/categories';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY = '#57CC99';
const SECONDARY = '#22577A';

const CATEGORY_STYLES: Record<
  Exclude<CategorySlug, never>,
  { bg: string; border: string }
> = {
  waste_recycling:    { bg: '#E6F7F0', border: '#57CC99' },
  upcycling_diy:      { bg: '#E0F7F6', border: '#38A3A5' },
  sustainable_living: { bg: '#F0FFF5', border: '#5ec175ff' },
  food_composting:    { bg: '#e8f2f6ff', border: '#4f81a2ff' },
  green_tech:         { bg: '#E8FBF9', border: '#38A3A5' },
  community_events:   { bg: '#ECFAF4', border: '#57CC99' },
};

export default function CommunityScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const { logout } = useContext(AuthContext);

  const fetchAllPages = async (firstUrl: string, headers: Record<string, string>) => {
    const all: any[] = [];
    let nextUrl: string | null = firstUrl;

    while (nextUrl) {
      const resp: any = await API.get(nextUrl, {
        headers,
        baseURL: nextUrl.startsWith('http') ? '' : API.defaults.baseURL,
      });

      if (Array.isArray(resp.data)) {
        all.push(...resp.data);
        nextUrl = null;
      } else {
        all.push(...(resp.data?.results ?? []));
        nextUrl = resp.data?.next ?? null;
      }
    }
    return all;
  };

  const fetchPosts = async (category: CategorySlug | 'all' = 'all') => {
    try {
      setLoading(true);
      const savedToken = await AsyncStorage.getItem('authToken');
      const headers: Record<string, string> = {};
      if (savedToken) headers.Authorization = `Token ${savedToken}`;

      const url = category === 'all' ? 'posts/' : `posts/?category=${encodeURIComponent(category)}`;

      const data = await fetchAllPages(url, headers);
      setPosts(data);
    } catch (error: any) {
      console.log('Error fetching posts:', error?.response?.status, error?.response?.data || error?.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts(activeCategory);
    }, [activeCategory])
  );

  const onSelectCategory = (slug: CategorySlug | 'all') => setActiveCategory(slug);

  const CategoryChip = ({ slug, label }: { slug: CategorySlug | 'all'; label: string }) => {
    const selected = activeCategory === slug;

    const selectedStyle =
      selected && slug !== 'all'
        ? { backgroundColor: CATEGORY_STYLES[slug].border, borderColor: CATEGORY_STYLES[slug].border }
        : selected && slug === 'all'
        ? { backgroundColor: PRIMARY, borderColor: PRIMARY }
        : {};

    return (
      <TouchableOpacity
        onPress={() => onSelectCategory(slug)}
        style={[styles.chip, selectedStyle]}
        activeOpacity={0.85}
      >
        <Text style={[styles.chipText, selected && { color: '#fff' }]} numberOfLines={1}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const catSlug = (item.category || 'waste_recycling') as CategorySlug;
    const style = CATEGORY_STYLES[catSlug] || { bg: '#F5F5F5', border: '#DDD' };

    return (
      <View style={[styles.post, { backgroundColor: style.bg, borderColor: style.border }]}>
        {}
        <Text style={[styles.postTitle, { color: style.border }]}>{item.title}</Text>
        <Text style={styles.postMeta}>
          {item.category_label ??
            CATEGORIES.find((c) => c.slug === item.category)?.label ??
            'Uncategorized'}
        </Text>
        <Text style={styles.postBody}>{item.content}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#CFF7D4', '#CFEFE9', '#BFE4EA']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.bg}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Scrapp Space</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreatePost')}
            activeOpacity={0.9}
            style={styles.primaryBtn}
          >
            <LinearGradient
              colors={['#57CC99', '#38A3A5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtnInner}
            >
              <Text style={styles.primaryBtnText}>Create Post</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout} activeOpacity={0.9} style={styles.primaryBtn}>
            <LinearGradient
              colors={['#22577A', '#38A3A5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtnInner}
            >
              <Text style={styles.primaryBtnText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <CategoryChip slug="all" label="All" />
        {CATEGORIES.map((c) => (
          <CategoryChip key={c.slug} slug={c.slug} label={c.label} />
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={PRIMARY} />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={<View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No posts found.</Text>}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: PRIMARY,
    textAlign: 'center',
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  primaryBtn: { borderRadius: 12, overflow: 'hidden' },
  primaryBtnInner: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  filters: { gap: 8, paddingVertical: 10, paddingHorizontal: 16 },

  chip: {
    height: 36,
    minWidth: 88,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9CCFC0',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: { color: SECONDARY, fontWeight: '700' },

  post: {
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
  },
  postTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  postMeta: { fontSize: 12, color: '#4B5563', marginBottom: 8 },
  postBody: { color: '#0F172A' },

  loadingWrap: { alignItems: 'center', paddingTop: 20 },
  loadingText: { color: SECONDARY, marginTop: 8 },
  empty: { textAlign: 'center', color: SECONDARY, marginTop: 24, fontWeight: '600' },
});