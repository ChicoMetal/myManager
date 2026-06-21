import { Stack, useRouter } from 'expo-router';
import { useColorScheme, TouchableOpacity } from 'react-native';
import { Home } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export default function EyeRestLayout() {
  const isDark = useColorScheme() === 'dark';
  const headerBg = isDark ? COLORS['neutral-900'] : COLORS['neutral-50'];
  const headerText = isDark ? COLORS['neutral-50'] : COLORS['neutral-900'];
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: headerText,
        headerShadowVisible: false,
        headerRight: () => (
          <TouchableOpacity onPress={() => router.dismissAll()} hitSlop={8}>
            <Home size={20} color={headerText} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Eye Rest' }} />
      <Stack.Screen name="modes" options={{ title: 'Modes' }} />
      <Stack.Screen name="mode/[id]" options={{ title: 'Edit Mode' }} />
      <Stack.Screen name="rest" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}
