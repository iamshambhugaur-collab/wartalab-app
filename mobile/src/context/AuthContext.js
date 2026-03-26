import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    bootstrap();
  }, []);

  const signIn = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const signUp = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, signIn, signUp, signOut }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
