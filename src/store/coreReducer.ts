import {createSlice} from '@reduxjs/toolkit';

import {Theme, GameMode, GameSubMode} from 'app/enums';

export interface CoreState {
  userInfo: {
    name: string;
    purpose: string;
    dateOfBirth: string;
  };
  theme: Theme;
  gameMode: GameMode;
  gameSubMode: GameSubMode;
  settings: {
    sound: number;
    vibro: boolean;
    pushNotifications: boolean;
  };
  globalScore: number;
}

export const initialUserInfo = {
  name: '',
  purpose: '',
  dateOfBirth: '',
};

const initialState: CoreState = {
  userInfo: initialUserInfo,
  gameSubMode: GameSubMode.normal,
  gameMode: GameMode.standart,
  theme: Theme.light,
  settings: {
    sound: 100,
    vibro: true,
    pushNotifications: false,
  },
  globalScore: 0,
};

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
    setGameMode: (state, action) => {
      state.gameMode = action.payload;
    },
    setGameSubMode: (state, action) => {
      state.gameSubMode = action.payload;
    },
    saveGlobalScore: (state, action) => {
      state.globalScore = state.globalScore + action.payload;
    },
    changeSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
    changeUserInfo: (state, action) => {
      state.userInfo = {
        ...state.settings,
        ...action.payload,
      };
    },
  },
});

export const {
  setGameMode,
  changeUserInfo,
  changeTheme,
  setGameSubMode,
  saveGlobalScore,
  changeSettings,
} = coreSlice.actions;
