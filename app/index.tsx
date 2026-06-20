import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeatureCard } from '@/components/FeatureCard';
import { Text } from '@/components/ui/Text';
import { FEATURES } from '@/lib/features';

export default function Dashboard() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView className="flex-1 px-4" contentContainerClassName="py-8 gap-4">
        <Text variant="2xl" className="mb-2">myManager</Text>
        {FEATURES.map(feature => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            icon={feature.icon}
            accentColor={feature.accentColor}
            status={feature.getStatus()}
            onPress={() => router.push(feature.route as any)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
