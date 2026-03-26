import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { SettingsProvider } from './src/context/SettingsContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SettingsProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
