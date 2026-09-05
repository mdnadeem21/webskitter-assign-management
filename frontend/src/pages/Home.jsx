import React, { useState, useEffect } from 'react';
import { Plus,Edit2,Trash2,CheckCircle,XCircle,Search,Filter,Users,ChevronLeft,ChevronRight, } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import api from '../services/axiosConfig';

// Mock data for tasks and users
const mockTasks = [
  {
    id: 1,
    title: 'Complete Project Proposal',
    description: 'Draft and finalize the project proposal document for client review.',
    status: 'Pending',
    priority: 'High',
    dueDate: '2026-09-10',
    assignedTo: { id: 1, name: 'John Doe' }, // Assigned user
    createdAt: '2026-09-01',
  },
  {
    id: 2,
    title: 'Design Database Schema',
    description: 'Create the database schema for the new application.',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2026-09-15',
    assignedTo: { id: 2, name: 'Jane Smith' },
    createdAt: '2026-09-02',
  },
  {
    id: 3,
    title: 'Implement Authentication',
    description: 'Set up user authentication using JWT.',
    status: 'Completed',
    priority: 'High',
    dueDate: '2026-09-05',
    assignedTo: { id: 1, name: 'John Doe' },
    createdAt: '2026-08-28',
  },
];

// Mock data for users
const mockUsers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
];

export default function HomePage() {
  // const { tasks, loading, error, getTasks, addTask, editTask, removeTask } = useTasks();
  const [tasks, setTasks] = useState(mockTasks);
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'add', 'edit', 'delete', 'complete'
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 4;

  // Fetch users and tasks (replace with API calls)
 // Fetch tasks and users on component mount
  // useEffect(() => {
  //   getTasks();
  //   // Fetch users if needed (e.g., for assignment dropdown)
  //   const fetchUsers = async () => {
  //     const response = await api.get('/auth/v1/get/all/users');
  //     setUsers(response.data.data);
  //   };
  //   fetchUsers();
  // }, [getTasks]);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  // Open modal for task actions
  const openModal = (task, action) => {
    setSelectedTask(task);
    setModalAction(action);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setModalAction(null);
  };

  // Handle task actions
  const handleAction = (formData) => {
    if (modalAction === 'add') {
      // Add new task
      const newTask = {
        id: tasks.length + 1,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        assignedTo: users.find((user) => user.id === parseInt(formData.assignedTo)),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks([...tasks, newTask]);
    } else if (modalAction === 'edit' && selectedTask) {
      // Edit existing task
      setTasks(
        tasks.map((task) =>
          task.id === selectedTask.id
            ? {
                ...task,
                title: formData.title,
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                dueDate: formData.dueDate,
                assignedTo: users.find((user) => user.id === parseInt(formData.assignedTo)),
              }
            : task
        )
      );
    } else if (modalAction === 'delete' && selectedTask) {
      // Delete task
      setTasks(tasks.filter((task) => task.id !== selectedTask.id));
    } else if (modalAction === 'complete' && selectedTask) {
      // Mark task as completed
      setTasks(
        tasks.map((task) =>
          task.id === selectedTask.id ? { ...task, status: 'Completed' } : task
        )
      );
    }
    closeModal();
  };

  // Status and priority options for filters
  const statusOptions = ['All', 'Pending', 'In Progress', 'Completed'];
  const priorityOptions = ['All', 'High', 'Medium', 'Low'];

  // Get status and priority colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 p-4 sm:p-6 lg:p-8">
      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 h-[40%] w-[40%] rounded-full bg-indigo-200/50 blur-[80px] dark:bg-indigo-900/20" />
        <div className="absolute bottom-0 right-0 h-[45%] w-[45%] rounded-full bg-violet-200/50 blur-[100px] dark:bg-violet-900/20" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tasks</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your tasks efficiently.
            </p>
          </div>
          <button
            onClick={() => openModal(null, 'add')}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 active:scale-[0.99] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="w-full pl-3 pr-8 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 appearance-none transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="relative">
              <select
                className="w-full pl-3 pr-8 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 appearance-none transition-all"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <div>Task</div>
              <div className="hidden md:block">Description</div>
              <div>Assigned To</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Actions</div>
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}
                      />
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">{task.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 md:hidden">
                          {task.description.substring(0, 50) + '...'}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
                      {task.description}
                    </div>
                    <div className="flex items-center gap-2">
                      {task.assignedTo?.profilePicture ? (
                        <img
                          src={task.assignedTo.profilePicture}
                          alt={task.assignedTo.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            {task.assignedTo?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {task.assignedTo?.name || 'Unassigned'}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(task, 'edit')}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal(task, 'delete')}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => openModal(task, 'complete')}
                          className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No tasks found.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Task Actions */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {modalAction === 'add'
                    ? 'Add Task'
                    : modalAction === 'edit'
                    ? 'Edit Task'
                    : modalAction === 'delete'
                    ? 'Delete Task'
                    : 'Complete Task'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              {modalAction === 'delete' ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                    <Trash2 className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Delete Task
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Are you sure you want to delete the task{' '}
                    <span className="font-medium text-slate-900 dark:text-white">
                      "{selectedTask?.title}"
                    </span>?
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAction()}
                      className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : modalAction === 'complete' ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Complete Task
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Are you sure you want to mark the task{' '}
                    <span className="font-medium text-slate-900 dark:text-white">
                      "{selectedTask?.title}"
                    </span>{' '}
                    as completed?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAction()}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ) : (
                <TaskForm
                  task={selectedTask}
                  users={users}
                  onSubmit={handleAction}
                  onCancel={closeModal}
                  action={modalAction}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Task Form Component (Extracted for reusability)
function TaskForm({ task, users, onSubmit, onCancel, action }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Pending',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate || '',
    assignedTo: task?.assignedTo?.id || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
          placeholder="Task title"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all resize-none"
          placeholder="Task description"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
          >
            {['Pending', 'In Progress', 'Completed'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
          >
            {['High', 'Medium', 'Low'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Assign To
        </label>
        <div className="relative">
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 appearance-none transition-all"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <Users className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
        >
          {action === 'add' ? 'Add Task' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}