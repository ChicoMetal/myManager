// Mock react-test-renderer for react-native testing
jest.mock('react-test-renderer', () => {
  return {
    create: jest.fn(),
    createRoot: jest.fn(() => ({
      render: jest.fn(),
      unmount: jest.fn(),
    })),
    act: jest.fn((cb) => cb()),
  };
});

// Mock react-native first - before any components are imported
jest.mock('react-native', () => {
  return {
    Text: function MockText(props) {
      return null;
    },
    View: function MockView(props) {
      return null;
    },
    TouchableOpacity: function MockTouchableOpacity(props) {
      return null;
    },
    TextInput: function MockTextInput(props) {
      return null;
    },
    TextProps: {},
    ViewProps: {},
    TouchableOpacityProps: {},
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
