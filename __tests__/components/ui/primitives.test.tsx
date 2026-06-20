import React from 'react';
import { Text as RNText, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

describe('UI Primitives', () => {
  describe('Text', () => {
    it('exports a function', () => {
      expect(typeof Text).toBe('function');
    });

    it('renders without crashing', () => {
      expect(() => {
        Text({
          variant: 'base',
          children: 'Hello',
        });
      }).not.toThrow();
    });

    it('accepts all variants', () => {
      const variants = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '4xl'] as const;
      variants.forEach((variant) => {
        expect(() => {
          Text({
            variant,
            children: 'Test',
          });
        }).not.toThrow();
      });
    });
  });

  describe('Button', () => {
    it('exports a function', () => {
      expect(typeof Button).toBe('function');
    });

    it('renders without crashing', () => {
      expect(() => {
        Button({
          variant: 'primary',
          label: 'Click me',
          onPress: jest.fn(),
        });
      }).not.toThrow();
    });

    it('accepts all variants', () => {
      const variants = ['primary', 'secondary', 'ghost'] as const;
      variants.forEach((variant) => {
        expect(() => {
          Button({
            variant,
            label: 'Test',
            onPress: jest.fn(),
          });
        }).not.toThrow();
      });
    });

    it('handles disabled prop', () => {
      expect(() => {
        Button({
          variant: 'primary',
          label: 'Test',
          onPress: jest.fn(),
          disabled: true,
        });
      }).not.toThrow();
    });
  });

  describe('Card', () => {
    it('exports a function', () => {
      expect(typeof Card).toBe('function');
    });

    it('renders without crashing', () => {
      expect(() => {
        Card({
          children: 'Content',
        });
      }).not.toThrow();
    });
  });

  describe('Badge', () => {
    it('exports a function', () => {
      expect(typeof Badge).toBe('function');
    });

    it('renders without crashing', () => {
      expect(() => {
        Badge({
          label: 'Active',
        });
      }).not.toThrow();
    });

    it('handles color prop', () => {
      expect(() => {
        Badge({
          label: 'Active',
          color: 'red',
        });
      }).not.toThrow();
    });
  });
});
