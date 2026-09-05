import { createSlice } from '@reduxjs/toolkit';

// Mock roles.json (same as your backend)
const roles = {
  admin: ["task:create", "task:read", "task:update", "task:delete",
          "user:create", "user:read", "user:update", "user:delete"],
  manager: ["task:create", "task:read", "task:update", "user:read"],
  user: ["task:read", "task:update"],
  author: ["task:create", "task:read", "task:update", "task:delete"]
};

const initialState = {
  user: null,
  status: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Login reducer (sets user and permissions)
    login: (state, action) => {
      state.user = {
        ...action.payload,
        permissions: roles[action.payload.role] || [],
      };
      state.status = true;
      state.error = null;
    },

    // Logout reducer (clears user and error)
    logout: (state) => {
      state.user = null;
      state.status = false;
      state.error = null;
    },

    // Set user reducer (updates user and permissions)
    setUser: (state, action) => {
      state.user = {
        ...action.payload,
        permissions: roles[action.payload.role] || [],
      };
      state.status = true;
      state.error = null;
    },
     // Register reducer (same as login, but for new users)
    register: (state, action) => {
      state.user = {
        ...action.payload,
        permissions: roles[action.payload.role] || [],
      };
      state.status = true;
      state.error = null;
    },
  },
});

export const { login, logout, setUser, register } = userSlice.actions;
export default userSlice.reducer;