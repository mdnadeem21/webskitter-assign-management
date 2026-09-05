import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/userSlice';
import taskReducer from '../store/taskSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    task: taskReducer, // Add the task reducer here
  },
});