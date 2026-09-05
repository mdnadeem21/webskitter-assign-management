import { useState } from 'react';
import { Edit2, Trash2, ShieldCheck, MoreVertical } from 'lucide-react';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    profilePicture: 'https://i.pravatar.cc/150?u=john',
    createdAt: '2026-01-01',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    profilePicture: 'https://i.pravatar.cc/150?u=jane',
    createdAt: '2026-01-02',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'user',
    profilePicture: 'https://i.pravatar.cc/150?u=alice',
    createdAt: '2026-01-03',
  },
  {
    id: 4,
    name: 'Bob Brown',
    email: 'bob@example.com',
    role: 'user',
    profilePicture: 'https://i.pravatar.cc/150?u=bob',
    createdAt: '2026-01-04',
  },
];

export default function UsersTable({ canManage }) {
  
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
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check permissions
  const canEditUser = canManage && user?.permissions?.includes('user:update');
  const canDeleteUser = canManage && user?.permissions?.includes('user:delete');

  // Handle user actions
  const handleAction = (action, user) => {
    switch (action) {
      case 'edit':
        alert(`Edit user: ${user.name}`);
        break;
      case 'delete':
        setUsers(users.filter((u) => u.id !== user.id));
        break;
      case 'changeRole':
        alert(`Change role for: ${user.name}`);
        break;
      default:
        break;
    }
    setIsMenuOpen(false);
  };

  // Get role colors
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
      case 'manager':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'user':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
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
              User
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Joined
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">{user.name}</h3>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {user.createdAt}
              </td>
              <td className="px-6 py-4">
                <div className="relative">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {isMenuOpen && selectedUser?.id === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                      {canEditUser && (
                        <>
                          <button
                            onClick={() => handleAction('edit', user)}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleAction('changeRole', user)}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            Change Role
                          </button>
                        </>
                      )}
                      {canDeleteUser && (
                        <button
                          onClick={() => handleAction('delete', user)}
                          className="w-full px-4 py-2 text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
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