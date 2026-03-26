import { useCallback, useEffect, useState } from 'react';
import { Button, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    const { data } = await api.get('/users');
    setUsers(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hello, {user.username}</Text>
      <View style={styles.actions}>
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
        <Button title="Offline P2P" onPress={() => navigation.navigate('OfflinePeer')} />
        <Button title="Logout" onPress={signOut} />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userRow} onPress={() => navigation.navigate('Chat', { peer: item })}>
            <View>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.status}>{item.online ? 'Online' : 'Offline'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  welcome: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  userRow: { padding: 14, borderWidth: 1, borderColor: '#efefef', borderRadius: 10, marginBottom: 10 },
  username: { fontSize: 16, fontWeight: '500' },
  status: { color: '#666', marginTop: 2 }
});
