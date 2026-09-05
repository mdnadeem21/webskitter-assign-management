import { useState } from 'react';
import TasksTable from '../components/TasksTable';
import UsersTable from '../components/UsersTable';
import StatsCard from '../components/StatsCard';
import { Plus, Users, ClipboardList, BarChart3 } from 'lucide-react';

// Mock data for stats
const mockStats = {
  totalTasks: 24,
  totalUsers: 12,
  pendingTasks: 8,
  completedTasks: 16,
};

export default function Dashboard() {
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
  const [activeTab, setActiveTab] = useState('tasks');

  // Check permissions from roles.json
  const canCreateTask = user?.permissions?.includes('task:create');
  const canReadUser = user?.permissions?.includes('user:read');
  const canManageUser = user?.permissions?.includes('user:create') ||
                       user?.permissions?.includes('user:update') ||
                       user?.permissions?.includes('user:delete');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 h-[40%] w-[40%] rounded-full bg-indigo-200/50 blur-[80px] dark:bg-indigo-900/20" />
        <div className="absolute bottom-0 right-0 h-[45%] w-[45%] rounded-full bg-violet-200/50 blur-[100px] dark:bg-violet-900/20" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {user?.role === 'admin' ? 'Admin Dashboard' :
             user?.role === 'manager' ? 'Manager Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {user?.role === 'admin' ? 'Manage users, tasks, and settings.' :
             user?.role === 'manager' ? 'Manage team tasks and assignments.' :
             'View and manage your assigned tasks.'}
          </p>
        </div>

        {/* Stats Cards (Visible to Managers and Admins) */}
        {(canReadUser || canManageUser) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Tasks"
              value={mockStats.totalTasks}
              icon={<ClipboardList className="h-6 w-6 text-indigo-600" />}
            />
            {canReadUser && (
              <StatsCard
                title="Total Users"
                value={mockStats.totalUsers}
                icon={<Users className="h-6 w-6 text-indigo-600" />}
              />
            )}
            <StatsCard
              title="Pending Tasks"
              value={mockStats.pendingTasks}
              icon={<BarChart3 className="h-6 w-6 text-indigo-600" />}
            />
          </div>
        )}

        {/* Tabs for Tasks and Users */}
        <div className="flex mb-6 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'tasks'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Tasks
          </button>
          {canReadUser && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                activeTab === 'users'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Users
            </button>
          )}
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {user?.role === 'admin' || user?.role === 'manager' ? 'All Tasks' : 'My Tasks'}
              </h2>
              {canCreateTask && (
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </button>
              )}
            </div>
            <TasksTable />
          </div>
        )}

        {/* Users Tab (Visible only to Admins and Managers) */}
        {activeTab === 'users' && canReadUser && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Users
              </h2>
              {canManageUser && (
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add User</span>
                </button>
              )}
            </div>
            <UsersTable canManage={canManageUser} />
          </div>
        )}
      </div>
    </div>
  );
}