
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
    Switch: (props) => React.createElement('Switch', { testID: props?.testID, value: props?.value, onValueChange: props?.onValueChange }),
    TextInput: (props) => React.createElement('TextInput', { ...props, style: StyleSheet.flatten(props?.style) }),
    ScrollView: (props) => React.createElement('ScrollView', { ...props, style: StyleSheet.flatten(props?.style) }),
    FlatList: (props) => React.createElement('FlatList', { ...props, style: StyleSheet.flatten(props?.style) }),
    Platform: { OS: 'ios' },
    useWindowDimensions: () => ({ width: 400, height: 800 }),
    AppState: {
      currentState: 'active',
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    Linking: {
      openSettings: jest.fn(),
    },
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
  Pause: () => null,
  Check: () => null,
  Eye: () => null,
  ChevronRight: () => null,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaView: (props) => React.createElement('SafeAreaView', props),
    SafeAreaProvider: (props) => React.createElement('SafeAreaProvider', props),
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
