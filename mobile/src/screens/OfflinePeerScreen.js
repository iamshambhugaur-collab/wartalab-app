import { useEffect, useRef, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { OfflinePeerService } from '../services/offlineP2P';

export default function OfflinePeerScreen() {
  const serviceRef = useRef(new OfflinePeerService());
  const [offer, setOffer] = useState('');
  const [answer, setAnswer] = useState('');
  const [remoteOffer, setRemoteOffer] = useState('');
  const [remoteAnswer, setRemoteAnswer] = useState('');
  const [iceFeed, setIceFeed] = useState('');
  const [peerIce, setPeerIce] = useState('');
  const [localMsg, setLocalMsg] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const service = serviceRef.current;
    service.onMessage = (msg) => setMessages((prev) => [...prev, `Peer: ${msg.content}`]);
    service.onSignal = (signal) => {
      if (signal.type === 'ice') {
        setIceFeed((prev) => `${prev}${signal.payload}\n`);
      }
    };

    return () => service.close();
  }, []);

  const createOffer = async () => {
    const generatedOffer = await serviceRef.current.initAsInitiator();
    setOffer(generatedOffer);
  };

  const createAnswer = async () => {
    if (!remoteOffer) return Alert.alert('Missing remote offer');
    const generatedAnswer = await serviceRef.current.initAsReceiver(remoteOffer);
    setAnswer(generatedAnswer);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.info}>Use this for offline local WiFi peer-to-peer chat. Exchange offers/answers and ICE candidates manually (QR/copy).</Text>
      <Button title="1) Create Offer" onPress={createOffer} />
      <TextInput style={styles.input} value={offer} editable={false} multiline placeholder="Your offer" />

      <TextInput style={styles.input} value={remoteOffer} onChangeText={setRemoteOffer} multiline placeholder="Paste remote offer" />
      <Button title="2) Create Answer from remote offer" onPress={createAnswer} />
      <TextInput style={styles.input} value={answer} editable={false} multiline placeholder="Your answer" />

      <TextInput style={styles.input} value={remoteAnswer} onChangeText={setRemoteAnswer} multiline placeholder="Paste remote answer" />
      <Button title="3) Accept remote answer" onPress={() => serviceRef.current.acceptAnswer(remoteAnswer)} />

      <TextInput style={styles.input} value={iceFeed} editable={false} multiline placeholder="Share these ICE candidates" />
      <TextInput style={styles.input} value={peerIce} onChangeText={setPeerIce} multiline placeholder="Paste one peer ICE candidate" />
      <Button title="Add Peer ICE" onPress={() => serviceRef.current.addIceCandidate(peerIce)} />

      <View style={styles.chatBox}>
        {messages.map((line, idx) => (
          <Text key={idx}>{line}</Text>
        ))}
      </View>
      <TextInput style={styles.input} value={localMsg} onChangeText={setLocalMsg} placeholder="Type offline message" />
      <Button
        title="Send Offline Message"
        onPress={() => {
          serviceRef.current.send({ content: localMsg });
          setMessages((prev) => [...prev, `Me: ${localMsg}`]);
          setLocalMsg('');
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  info: { marginBottom: 10, color: '#444' },
  input: { minHeight: 56, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 },
  chatBox: { minHeight: 120, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 }
});
