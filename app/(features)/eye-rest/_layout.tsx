import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/colors';

export default function EyeRestLayout() {
  const isDark = useColorScheme() === 'dark';
  const headerBg = isDark ? COLORS['neutral-800'] : '#ffffff';
  const headerText = isDark ? COLORS['neutral-50'] : COLORS['neutral-900'];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: headerText,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Eye Rest' }} />
      <Stack.Screen name="modes" options={{ title: 'Modes' }} />
      <Stack.Screen name="mode/[id]" options={{ title: 'Edit Mode' }} />
      <Stack.Screen name="rest" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}
