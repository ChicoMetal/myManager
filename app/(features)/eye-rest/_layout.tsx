import { Stack } from 'expo-router';

export default function EyeRestLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Eye Rest', headerShown: true }} />
      <Stack.Screen name="modes" options={{ title: 'Modes', headerShown: true }} />
      <Stack.Screen name="mode/[id]" options={{ title: 'Edit Mode', headerShown: true }} />
      <Stack.Screen name="rest" options={{ title: 'Rest', headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}
