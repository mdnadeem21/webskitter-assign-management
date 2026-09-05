import { useState } from 'react';
import { Edit2, Trash2, CheckCircle, Eye, MoreVertical } from 'lucide-react';

// Mock data for tasks
const mockTasks = [
  {
    id: 1,
    title: 'Complete Project Proposal',
    description: 'Draft and finalize the project proposal document for client review.',
    status: 'Pending',
    priority: 'High',
    dueDate: '2026-09-10',
    assignedTo: { id: 2, name: 'Jane Smith', profilePicture: 'https://i.pravatar.cc/150?u=jane' },
    createdBy: { id: 1, name: 'John Doe' },
  },
  {
    id: 2,
    title: 'Design Database Schema',
    description: 'Create the database schema for the new application.',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2026-09-15',
    assignedTo: { id: 3, name: 'Alice Johnson', profilePicture: 'https://i.pravatar.cc/150?u=alice' },
    createdBy: { id: 1, name: 'John Doe' },
  },
  {
    id: 3,
    title: 'Implement Authentication',
    description: 'Set up user authentication using JWT.',
    status: 'Completed',
    priority: 'High',
    dueDate: '2026-09-05',
    assignedTo: { id: 1, name: 'John Doe', profilePicture: 'https://i.pravatar.cc/150?u=john' },
    createdBy: { id: 1, name: 'John Doe' },
  },
  {
    id: 4,
    title: 'Write API Documentation',
    description: 'Document all API endpoints for the backend.',
    status: 'Pending',
    priority: 'Low',
    dueDate: '2026-09-20',
    assignedTo: null,
    createdBy: { id: 2, name: 'Jane Smith' },
  },
];

export default function TasksTable() {
  // Mock roles.json
    const roles = {
      admin: ["task:create", "task:read", "task:update", "task:delete",
              "user:create", "user:read", "user:update", "user:delete"],
      manager: ["task:create", "task:read", "task:update", "user:read"],
      user: ["task:read", "task:update"]
    };

  // Mock loggedIn user
  const user = {
    _id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "manager", // Change to "manager" or "user" to test different roles
  profilePicture: "https://i.pravatar.cc/150?u=john",
  permissions: roles.manager, // Assign permissions based on role
  };
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check permissions
  const canEditTask = user?.permissions?.includes('task:update');
  const canDeleteTask = user?.permissions?.includes('task:delete');

  // Handle task actions
  const handleAction = (action, task) => {
    switch (action) {
      case 'edit':
        alert(`Edit task: ${task.title}`);
        break;
      case 'delete':
        setTasks(tasks.filter((t) => t.id !== task.id));
        break;
      case 'complete':
        setTasks(
          tasks.map((t) =>
            t.id === task.id ? { ...t, status: 'Completed' } : t
          )
        );
        break;
      case 'view':
        alert(`View task: ${task.title}`);
        break;
      default:
        break;
    }
    setIsMenuOpen(false);
  };

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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Task
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Assigned To
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Priority
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Due Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-6 py-4">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{task.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {task.description.substring(0, 50)}...
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {task.assignedTo?.profilePicture ? (
                    <img
                      src={task.assignedTo.profilePicture}
                      alt={task.assignedTo.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {task.assignedTo?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {task.assignedTo?.name || 'Unassigned'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {task.dueDate}
              </td>
              <td className="px-6 py-4">
                <div className="relative">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {isMenuOpen && selectedTask?.id === task.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                      <button
                        onClick={() => handleAction('view', task)}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      {canEditTask && (
                        <button
                          onClick={() => handleAction('edit', task)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                      )}
                      {canDeleteTask && (
                        <button
                          onClick={() => handleAction('delete', task)}
                          className="w-full px-4 py-2 text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleAction('complete', task)}
                          className="w-full px-4 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}