import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { STICKERS } from '../types';

export default function StickerPicker({ onPick }) {
  return (
    <View style={styles.container}>
      {STICKERS.map((sticker) => (
        <TouchableOpacity key={sticker} onPress={() => onPick(sticker)} style={styles.stickerBtn}>
          <Text style={styles.stickerText}>{sticker}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 8
  },
  stickerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#eef1ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stickerText: {
    fontSize: 20
  }
});
