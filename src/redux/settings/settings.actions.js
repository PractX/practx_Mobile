import SettingsActionTypes from './settings.types';

export const setTheme = (mode) => ({
  type: SettingsActionTypes.SET_THEME,
  payload: mode,
});
export const onScroll = (cond) => ({
  type: SettingsActionTypes.ON_SCROLL,
  payload: cond,
});
export const speedDownloadActive = (cond) => ({
  type: SettingsActionTypes.SPEED_DOWNLOAD_ACTIVE,
  payload: cond,
});

export const netState = (state) => ({
  type: SettingsActionTypes.NET_STATE,
  payload: state,
});

export const playSound = (state) => ({
  type: SettingsActionTypes.PLAY_SOUND,
  payload: state,
});

export const soundAlert = (state) => ({
  type: SettingsActionTypes.SOUND_ALERT,
  payload: state,
});
export const showNetState = (state) => ({
  type: SettingsActionTypes.SHOW_NET_STATE,
  payload: state,
});
export const showDownloadNotify = (state) => ({
  type: SettingsActionTypes.SHOW_DOWNLOAD_NOTIFY,
  payload: state,
});
export const showMusicNotify = (state) => ({
  type: SettingsActionTypes.SHOW_MUSIC_NOTIFY,
  payload: state,
});
export const showIntro = (state) => ({
  type: SettingsActionTypes.SHOW_INTRO,
  payload: state,
});
export const setFirstLunch = (state) => ({
  type: SettingsActionTypes.SET_FIRST_LUNCH,
  payload: state,
});
export const downloadStorage = (state) => ({
  type: SettingsActionTypes.DOWNLOAD_STORAGE,
  payload: state,
});
export const getMont = () => ({
  type: SettingsActionTypes.GET_MONT,
});
export const setMont = (state) => ({
  type: SettingsActionTypes.SET_MONT,
  payload: state,
});
export const setWpStat = (state) => ({
  type: SettingsActionTypes.SET_WP_STAT,
  payload: state,
});
