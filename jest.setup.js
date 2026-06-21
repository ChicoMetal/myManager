
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
    Alert: {
      alert: jest.fn(),
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

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  NotificationFeedbackType: { Success: 'success' },
}));

// Mock expo-audio (replaced expo-av for SDK 56 compat)
jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({ play: jest.fn(), remove: jest.fn() })),
  setIsAudioActiveAsync: jest.fn().mockResolvedValue(undefined),
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Play: () => null,
  Pause: () => null,
  Moon: () => null,
  Check: () => null,
  Eye: () => null,
  ChevronRight: () => null,
  Plus: () => null,
  Trash2: () => null,
}));

// Capture real setImmediate before any test file can install fake timers.
const _realSetImmediate = setImmediate;

// Reset React act environment and drain pending async work before each test.
// This prevents actScopeDepth corruption in React 19 from unawaited fireEvent calls.
beforeEach(async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  // Drain any pending microtasks from previous async tests.
  // Use the real setImmediate so this works even when a test file has called
  // jest.useFakeTimers() at module scope (which replaces the global setImmediate).
  await new Promise((resolve) => _realSetImmediate(resolve));
  await new Promise((resolve) => _realSetImmediate(resolve));

  // Reset React 19 actScopeDepth if it was corrupted by an unawaited async act()
  // in a previous test (e.g. from unawaited fireEvent.press() calls).
  // actScopeDepth is a module-scoped variable; we reset it by calling act() with
  // a no-op sync callback, which pops the scope back to 0 and flushes the queue.
  try {
    const React = require('react');
    const internals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    if (internals) {
      // Clear any stale actQueue so the next test starts clean.
      internals.actQueue = null;
    }
  } catch (_e) {
    // Ignore — not all environments expose React internals
  }
});

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
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), dismissAll: jest.fn() }),
  useLocalSearchParams: jest.fn(() => ({})),
  useFocusEffect: jest.fn(),
  Link: ({ children }) => children,
  Stack: Object.assign(() => null, { Screen: () => null }),
}));
