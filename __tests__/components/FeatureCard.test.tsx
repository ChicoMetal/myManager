import React from 'react';
import { FeatureCard } from '@/components/FeatureCard';

describe('FeatureCard', () => {
  it('exports a function', () => {
    expect(typeof FeatureCard).toBe('function');
  });

  it('renders without crashing', () => {
    const onPress = jest.fn();
    expect(() => {
      FeatureCard({
        title: 'Eye Rest',
        icon: 'Eye',
        accentColor: '#a2d2ff',
        status: 'Active · 20 min',
        onPress,
      });
    }).not.toThrow();
  });

  it('accepts onPress prop', () => {
    const onPress = jest.fn();
    const component = FeatureCard({
      title: 'Eye Rest',
      icon: 'Eye',
      accentColor: '#a2d2ff',
      status: 'Active · 20 min',
      onPress,
    });
    expect(component).toBeTruthy();
    expect(onPress).not.toHaveBeenCalled();
  });
});
