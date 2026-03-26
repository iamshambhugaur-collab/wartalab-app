import { Image, StyleSheet, Text, View } from 'react-native';

export default function MessageBubble({ message, isMine, fontStyle }) {
  return (
    <View style={[styles.row, isMine ? styles.mineRow : styles.peerRow]}>
      <View style={[styles.bubble, isMine ? styles.mine : styles.peer]}>
        {message.type === 'image' && !!message.imageUrl && (
          <Image source={{ uri: message.imageUrl }} style={styles.image} />
        )}
        {message.type === 'sticker' ? (
          <Text style={styles.sticker}>{message.sticker || '😀'}</Text>
        ) : (
          !!message.content && <Text style={{ fontFamily: fontStyle }}>{message.content}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 6,
    flexDirection: 'row'
  },
  mineRow: {
    justifyContent: 'flex-end'
  },
  peerRow: {
    justifyContent: 'flex-start'
  },
  bubble: {
    maxWidth: '76%',
    padding: 10,
    borderRadius: 12
  },
  mine: {
    backgroundColor: '#d7ecff'
  },
  peer: {
    backgroundColor: '#f1f1f1'
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginBottom: 8
  },
  sticker: {
    fontSize: 28
  }
});
