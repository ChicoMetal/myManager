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
    TextProps: {},
    ViewProps: {},
    TouchableOpacityProps: {},
  };
});

// Mock NativeWind
jest.mock('nativewind', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));
