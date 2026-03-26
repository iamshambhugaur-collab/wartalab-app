import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';
import API_BASE_URL from '../services/api';
import { connectSocket, getSocket } from '../services/socket';
import MessageBubble from '../components/MessageBubble';
import StickerPicker from '../components/StickerPicker';
import { MESSAGE_TYPES } from '../types';

const buildImageUri = (relativeOrAbsolute) =>
  relativeOrAbsolute?.startsWith('http')
    ? relativeOrAbsolute
    : `${API_BASE_URL.replace('/api', '')}${relativeOrAbsolute}`;

export default function ChatScreen({ route }) {
  const { peer } = route.params;
  const { user } = useAuth();
  const { chatBackground, fontStyle } = useSettings();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showStickers, setShowStickers] = useState(false);

  const socket = useMemo(() => connectSocket(API_BASE_URL, user.id), [user.id]);

  const loadMessages = async () => {
    const { data } = await api.get(`/chat/${peer._id}`);
    setMessages(data.messages);
  };

  useEffect(() => {
    loadMessages();

    const currentSocket = getSocket();
    currentSocket.on('chat:message', (message) => {
      if (
        (message.senderId === peer._id && message.receiverId === user.id) ||
        (message.senderId === user.id && message.receiverId === peer._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    currentSocket.on('chat:delivered', (message) => {
      if (message.receiverId === peer._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      currentSocket.off('chat:message');
      currentSocket.off('chat:delivered');
    };
  }, [peer._id, user.id]);

  const sendText = async () => {
    if (!text.trim()) return;

    const clientTempId = uuidv4();

    socket.emit('chat:send', {
      senderId: user.id,
      receiverId: peer._id,
      type: MESSAGE_TYPES.TEXT,
      content: text,
      clientTempId
    });

    setText('');
  };

  const sendSticker = (sticker) => {
    socket.emit('chat:send', {
      senderId: user.id,
      receiverId: peer._id,
      type: MESSAGE_TYPES.STICKER,
      sticker,
      content: ''
    });
    setShowStickers(false);
  };

  const sendImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    });

    if (result.canceled) return;

    const selected = result.assets[0];

    const formData = new FormData();
    formData.append('receiverId', peer._id);
    formData.append('type', MESSAGE_TYPES.IMAGE);
    formData.append('image', {
      uri: selected.uri,
      name: 'chat-image.jpg',
      type: 'image/jpeg'
    });

    const { data } = await api.post('/chat/send', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setMessages((prev) => [...prev, data.message]);
  };

  return (
    <View style={[styles.container, { backgroundColor: chatBackground }]}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id || item.clientTempId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MessageBubble
            message={{ ...item, imageUrl: buildImageUri(item.imageUrl) }}
            isMine={item.senderId === user.id}
            fontStyle={fontStyle}
          />
        )}
      />

      {showStickers && <StickerPicker onPick={sendSticker} />}

      <View style={styles.composerRow}>
        <TextInput
          style={styles.input}
          placeholder="Type message..."
          value={text}
          onChangeText={setText}
          multiline
        />
        <Button title="😊" onPress={() => setShowStickers((prev) => !prev)} />
        <Button title="Img" onPress={sendImage} />
        <Button title="Send" onPress={sendText} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  listContent: { paddingBottom: 10 },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxHeight: 100,
    backgroundColor: '#fff'
  }
});
