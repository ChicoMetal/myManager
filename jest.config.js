module.exports = {
  testEnvironment: 'node',
  // When jest.useFakeTimers() is called with no args (as in rest.test.tsx),
  // Jest merges this config into the call. Excluding setImmediate prevents
  // React 19's scheduler from being intercepted by fake timers, which would
  // cause "unawaited act()" errors and break countdown-based tests.
  fakeTimers: {
    // Exclude setImmediate and queueMicrotask from being faked.
    // React 19's scheduler uses setImmediate and its act() uses queueMicrotask.
    // If either is faked, jest.advanceTimersByTime() inside act() triggers
    // unawaited async act() calls that corrupt React's actScopeDepth, causing
    // state updates to never flush and tests to fail.
    doNotFake: ['setImmediate', 'queueMicrotask'],
  },
  moduleNameMapper: {
    '\\.wav$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
      diagnostics: false,
    }],
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
};
