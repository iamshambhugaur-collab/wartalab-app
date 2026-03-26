import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { CHAT_BACKGROUNDS, FONT_STYLES } from '../types';

export default function SettingsScreen() {
  const { chatBackground, setChatBackground, fontStyle, setFontStyle } = useSettings();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chat Background</Text>
      <View style={styles.row}>
        {CHAT_BACKGROUNDS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.color, { backgroundColor: color }, chatBackground === color && styles.selected]}
            onPress={() => setChatBackground(color)}
          />
        ))}
      </View>

      <Text style={styles.heading}>Font Style</Text>
      <View style={styles.row}>
        {FONT_STYLES.map((font) => (
          <TouchableOpacity key={font} onPress={() => setFontStyle(font)} style={[styles.fontBtn, fontStyle === font && styles.selectedFont]}>
            <Text style={{ fontFamily: font, color: '#333' }}>{font}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  heading: { fontWeight: '700', fontSize: 16, marginTop: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  color: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#ddd' },
  selected: { borderColor: '#2e7bff', borderWidth: 3 },
  fontBtn: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8 },
  selectedFont: { borderColor: '#2e7bff', backgroundColor: '#edf4ff' }
});
