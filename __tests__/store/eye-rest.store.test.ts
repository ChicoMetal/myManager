import { useEyeRestStore } from '@/store/eye-rest.store';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const DEFAULT_MODE_ID = 'default';

const defaultMode = {
  id: DEFAULT_MODE_ID,
  name: 'Default',
  intervalMinutes: 20,
  restDurationSeconds: 20,
  activeStart: '09:00',
  activeEnd: '18:00',
  activeDays: [1, 2, 3, 4, 5],
  sound: null,
};

beforeEach(() => {
  useEyeRestStore.setState({
    enabled: false,
    pausedModeIds: [],
    activeModeIds: [DEFAULT_MODE_ID],
    modes: [defaultMode],
    nextFireAt: null,
  });
});

describe('useEyeRestStore', () => {
  it('setEnabled toggles enabled state', () => {
    useEyeRestStore.getState().setEnabled(true);
    expect(useEyeRestStore.getState().enabled).toBe(true);
  });

  it('toggleModeActive adds an inactive mode to activeModeIds', () => {
    const added = useEyeRestStore.getState().addMode({
      name: 'Long Rest',
      intervalMinutes: 60,
      restDurationSeconds: 60,
      activeStart: '09:00',
      activeEnd: '18:00',
      activeDays: [1, 2, 3, 4, 5],
      sound: null,
    });
    useEyeRestStore.getState().toggleModeActive(added.id);
    expect(useEyeRestStore.getState().activeModeIds).toContain(added.id);
  });

  it('toggleModeActive removes an active mode from activeModeIds', () => {
    const added = useEyeRestStore.getState().addMode({
      name: 'Long Rest',
      intervalMinutes: 60,
      restDurationSeconds: 60,
      activeStart: '09:00',
      activeEnd: '18:00',
      activeDays: [1, 2, 3, 4, 5],
      sound: null,
    });
    useEyeRestStore.getState().setModeActive(added.id, true);
    useEyeRestStore.getState().toggleModeActive(added.id);
    expect(useEyeRestStore.getState().activeModeIds).not.toContain(added.id);
  });

  it('toggleModeActive does not remove the last active mode', () => {
    useEyeRestStore.getState().toggleModeActive(DEFAULT_MODE_ID);
    expect(useEyeRestStore.getState().activeModeIds).toContain(DEFAULT_MODE_ID);
  });

  it('toggleModePaused adds and removes mode from pausedModeIds', () => {
    useEyeRestStore.getState().toggleModePaused(DEFAULT_MODE_ID);
    expect(useEyeRestStore.getState().pausedModeIds).toContain(DEFAULT_MODE_ID);
    useEyeRestStore.getState().toggleModePaused(DEFAULT_MODE_ID);
    expect(useEyeRestStore.getState().pausedModeIds).not.toContain(DEFAULT_MODE_ID);
  });

  it('addMode adds a new mode and returns it with restDurationSeconds', () => {
    const newMode = useEyeRestStore.getState().addMode({
      name: 'Weekend',
      intervalMinutes: 30,
      restDurationSeconds: 30,
      activeStart: '10:00',
      activeEnd: '16:00',
      activeDays: [0, 6],
      sound: 'chime',
    });
    const modes = useEyeRestStore.getState().modes;
    expect(modes).toHaveLength(2);
    expect(newMode.name).toBe('Weekend');
    expect(newMode.restDurationSeconds).toBe(30);
    expect(newMode.sound).toBe('chime');
    expect(typeof newMode.id).toBe('string');
  });

  it('updateMode updates fields including sound and restDurationSeconds', () => {
    useEyeRestStore.getState().updateMode(DEFAULT_MODE_ID, { intervalMinutes: 30, sound: 'bell', restDurationSeconds: 60 });
    const mode = useEyeRestStore.getState().modes.find(m => m.id === DEFAULT_MODE_ID);
    expect(mode?.intervalMinutes).toBe(30);
    expect(mode?.sound).toBe('bell');
    expect(mode?.restDurationSeconds).toBe(60);
  });

  it('deleteMode removes a non-active mode', () => {
    const added = useEyeRestStore.getState().addMode({
      name: 'Study',
      intervalMinutes: 15,
      restDurationSeconds: 20,
      activeStart: '08:00',
      activeEnd: '17:00',
      activeDays: [1, 2, 3, 4, 5],
      sound: null,
    });
    useEyeRestStore.getState().deleteMode(added.id);
    expect(useEyeRestStore.getState().modes.find(m => m.id === added.id)).toBeUndefined();
  });

  it('deleteMode does not remove the last remaining mode', () => {
    useEyeRestStore.getState().deleteMode(DEFAULT_MODE_ID);
    expect(useEyeRestStore.getState().modes).toHaveLength(1);
  });

  it('getActiveModes returns all active modes', () => {
    const modes = useEyeRestStore.getState().getActiveModes();
    expect(modes).toHaveLength(1);
    expect(modes[0].id).toBe(DEFAULT_MODE_ID);
  });

  it('getStatusLine returns "Off" when disabled', () => {
    expect(useEyeRestStore.getState().getStatusLine()).toBe('Off');
  });

  it('getStatusLine returns active count when enabled', () => {
    useEyeRestStore.getState().setEnabled(true);
    const line = useEyeRestStore.getState().getStatusLine();
    expect(line).toContain('1 active');
  });
});
