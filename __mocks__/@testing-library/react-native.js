// Sync-compatible wrapper around RNTL v14's async render API.
// RNTL v14 made render() async due to React 19's act() being async.
// This wrapper uses React.act() directly (sync when callback is sync)
// so existing tests that destructure render() without await continue to work.

const actual = jest.requireActual('@testing-library/react-native');
const { createRoot } = require('test-renderer');
const withinModule = require('@testing-library/react-native/dist/within');
const cleanupModule = require('@testing-library/react-native/dist/cleanup');
const screenModule = require('@testing-library/react-native/dist/screen');
const hostComponentNamesModule = require('@testing-library/react-native/dist/helpers/host-component-names');
const React = require('react');

// Set act environment so React doesn't warn
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function renderSync(element, options = {}) {
  const { wrapper: Wrapper } = options || {};

  const rendererOptions = {
    textComponentTypes: hostComponentNamesModule.HOST_TEXT_NAMES,
    publicTextComponentTypes: ['Text'],
    transformHiddenInstanceProps: ({ props }) => ({
      ...props,
      style: props.style == null ? { display: 'none' } : [props.style, { display: 'none' }],
    }),
  };

  const wrap = (el) => Wrapper ? React.createElement(Wrapper, null, el) : el;
  const renderer = createRoot(rendererOptions);

  // Use React.act() synchronously — when the callback doesn't return a Promise,
  // React 19's act() commits synchronously.
  React.act(() => {
    renderer.render(wrap(element));
  });
  // If actScopeDepth is corrupted (stuck > 0 from overlapping unawaited async acts
  // in a previous test), React.act's flushActQueue is skipped. We manually flush
  // ReactSharedInternals.actQueue to commit the render work.
  try {
    const internals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    if (internals && internals.actQueue && internals.actQueue.length > 0) {
      const queue = internals.actQueue;
      let i = 0;
      while (i < queue.length) {
        const callback = queue[i];
        let continuation = callback(false);
        while (continuation !== null && continuation !== undefined) {
          continuation = continuation(false);
        }
        i++;
      }
      queue.length = 0;
    }
  } catch (e) {
    // Ignore errors from manual flush; tests will fail naturally if render doesn't work
  }

  const container = renderer.container;

  const rerender = (component) => {
    React.act(() => {
      renderer.render(wrap(component));
    });
  };

  const unmount = () => {
    React.act(() => {
      renderer.unmount();
    });
  };

  const toJSON = () => {
    const json = renderer.container.toJSON();
    if (json?.children.length === 0) return null;
    if (json?.children.length === 1 && typeof json.children[0] !== 'string') {
      return json.children[0];
    }
    return json;
  };

  cleanupModule.addToCleanupQueue(unmount);

  const result = {
    ...withinModule.getQueriesForInstance(renderer.container),
    rerender,
    unmount,
    toJSON,
    debug: () => {},
    get container() { return renderer.container; },
    get root() {
      const firstChild = container.children[0];
      if (typeof firstChild === 'string') {
        throw new Error('Root element must be a host element.');
      }
      return firstChild;
    },
  };

  screenModule.setRenderResult(result);
  return result;
}

module.exports = {
  ...actual,
  render: renderSync,
};
