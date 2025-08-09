import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainStack from './navigation/MainStack';  // Stack with Tabs + CreatePostScreen
import { AuthProvider, AuthContext } from './context/AuthContext';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { authToken } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authToken ? (
        // User is logged in, show the main app stack (tabs + create post)
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        // User not logged in, show auth screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}