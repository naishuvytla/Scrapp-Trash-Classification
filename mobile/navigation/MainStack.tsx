import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import CreatePostScreen from '../screens/CreatePostScreen';
import CameraScreen from '../screens/CameraScreen';
import ResultScreen from '../screens/ResultScreen';
import { Platform } from 'react-native';
import type { ClassifyResponse } from '../api/classifier';
import DisposalChatScreen from "../screens/DisposalChatScreen";

export type MainStackParamList = {
  Tabs: undefined;
  Camera: undefined;
  Result: { uri: string; result: ClassifyResponse };
  CreatePost: undefined;
  DisposalChat: { label?: string; instructions?: string };
};

const PRIMARY = '#57CC99';
const SECONDARY = '#22577A';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: SECONDARY + 'AA',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerTransparent: true,
        headerBlurEffect: Platform.OS === 'ios' ? 'systemUltraThinMaterialLight' : undefined,
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Scan Trash',
          headerBackTitle: 'Home',
        }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Result' }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: 'New Post' }}
      />
      <Stack.Screen
        name="DisposalChat"
        component={DisposalChatScreen}
        options={{ title: "Disposal Chat" }}
      />
    </Stack.Navigator>
  );
}
