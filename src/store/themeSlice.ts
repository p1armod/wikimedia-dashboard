import { createSlice } from '@reduxjs/toolkit';



function getInitialTheme(): 'dark' | 'light' {
  const stored = localStorage.getItem('wikimedia-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

interface ThemeState {
  mode: 'dark' | 'light';
}

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('wikimedia-theme', state.mode);

      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

// Define Redux state slice
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
