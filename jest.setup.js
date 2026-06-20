
// Mock StyleSheet
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: (styles) => styles,
  flatten: (style) => {
    if (Array.isArray(style)) {
      return style.reduce((acc, s) => ({ ...acc, ...s }), {});
    }
    return style || {};
  },
}));

// Mock react-native with proper render support for react-testing-library
jest.mock('react-native', () => {
  const React = require('react');
  const StyleSheet = require('react-native/Libraries/StyleSheet/StyleSheet');

  return {
    View: (props) => React.createElement('View', { ...props, style: StyleSheet.flatten(props?.style) }),
    Text: (props) => React.createElement('Text', { ...props, style: StyleSheet.flatten(props?.style) }),
    TouchableOpacity: (props) => React.createElement('TouchableOpacity', { ...props, style: StyleSheet.flatten(props?.style) }),
    TextInput: (props) => React.createElement('TextInput', { ...props, style: StyleSheet.flatten(props?.style) }),
    ScrollView: (props) => React.createElement('ScrollView', { ...props, style: StyleSheet.flatten(props?.style) }),
    FlatList: (props) => React.createElement('FlatList', { ...props, style: StyleSheet.flatten(props?.style) }),
    Platform: { OS: 'ios' },
    useWindowDimensions: () => ({ width: 400, height: 800 }),
    Animated: {
      View: (props) => React.createElement('View', { ...props, style: StyleSheet.flatten(props?.style) }),
      createValue: () => ({ addListener: jest.fn() }),
      timing: jest.fn(),
      sequence: jest.fn(),
    },
    StyleSheet,
  };
});

// Mock NativeWind
jest.mock('nativewind', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Play: () => null,
  Check: () => null,
}));
