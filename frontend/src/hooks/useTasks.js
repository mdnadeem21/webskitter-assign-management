import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from '../store/taskSlice';
import api from '../services/axiosConfig';

export const useTasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.task);

  // Fetch all tasks
  const getTasks = async () => {
    dispatch(setLoading(true));
    try {
      const response = await api.get('/get/all/tasks');
      dispatch(fetchTasks(response.data.data));
    } catch (err) {
      dispatch(setError(err.response?.data?.error || err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await api.post('/create/task', taskData);
      dispatch(createTask(response.data.data));
    } catch (error) {
      console.error('Failed to create task:', error.message);
    }
  };

  const editTask = async (id, taskData) => {
    try {
      const response = await api.put(`/update/task/${id}`, taskData);
      dispatch(updateTask({ id, updatedTask: response.data.data }));
    } catch (error) {
      console.error('Failed to update task:', error.message);
    }
  };

  const removeTask = async (id) => {
    try {
      await api.put(`/delete/task/${id}`);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error('Failed to delete task:', error.message);
    }
  };

  return {
    tasks,
    loading,
    error,
    getTasks,
    addTask,
    editTask,
    removeTask,
  };
};