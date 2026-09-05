// store/slices/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Fetch tasks 
    fetchTasks: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Create task
    createTask: (state, action) => {
      state.tasks.push(action.payload);
    },

    // Update task
    updateTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      state.tasks = state.tasks.map(task =>
        task._id === id ? updatedTask : task
      );
    },

    // Delete task
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    },
  },
});

export const {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} = taskSlice.actions;

export default taskSlice.reducer;