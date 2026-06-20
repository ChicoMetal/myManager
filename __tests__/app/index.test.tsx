import React from 'react';
import Dashboard from '@/app/index';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/lib/features', () => ({
  FEATURES: [
    {
      id: 'eye-rest',
      title: 'Eye Rest',
      icon: 'Eye',
      route: '/(features)/eye-rest',
      accentColor: '#a2d2ff',
      getStatus: () => 'Off',
    },
  ],
}));

describe('Dashboard', () => {
  it('exports a function', () => {
    expect(typeof Dashboard).toBe('function');
  });

  it('renders without crashing', () => {
    expect(() => {
      Dashboard();
    }).not.toThrow();
  });

  it('renders successfully', () => {
    const component = Dashboard();
    expect(component).toBeTruthy();
  });
});
