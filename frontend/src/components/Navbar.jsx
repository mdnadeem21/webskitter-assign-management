// import React, { useState, useEffect, useRef } from 'react';
// import { CheckSquare, Bell, Menu, X, Plus, LayoutDashboard, ListTodo, Calendar, Settings, LogOut, User } from 'lucide-react';

// export default function Navbar() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
//   const profileRef = useRef(null);
//   const notificationRef = useRef(null);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setIsNotificationsOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Mock Data for Task Notifications
//   const notifications = [
//     { id: 1, text: "Task 'API Integration' is overdue", time: "2m ago", unread: true },
//     { id: 2, text: "Rahul assigned you a new task", time: "1h ago", unread: true },
//     { id: 3, text: "Database migration completed", time: "Yesterday", unread: false },
//   ];

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
          
//           {/* LEFT: Logo & Main Navigation */}
//           <div className="flex items-center gap-8">
//             {/* Logo */}
//             <div className="flex items-center gap-2 cursor-pointer">
//               <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
//                 <CheckSquare className="h-5 w-5" />
//               </div>
//               <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
//                 Task<span className="text-indigo-600">Flow</span>
//               </span>
//             </div>

//             {/* Desktop Navigation Links */}
//             <div className="hidden md:flex items-center gap-1">
//               <a href="#dashboard" className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
//                 <LayoutDashboard className="h-4 w-4" /> Dashboard
//               </a>
//               <a href="#tasks" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
//                 <ListTodo className="h-4 w-4" /> My Tasks
//               </a>
//               <a href="#calendar" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
//                 <Calendar className="h-4 w-4" /> Calendar
//               </a>
//             </div>
//           </div>

//           {/* RIGHT: Quick Actions & Profile */}
//           <div className="hidden md:flex items-center gap-4">
            
//             {/* Quick Action Button: Create Task */}
//             <button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-200 active:scale-95 dark:shadow-none">
//               <Plus className="h-4 w-4" /> Create Task
//             </button>

//             {/* Notification Bell Dropdown */}
//             <div className="relative" ref={notificationRef}>
//               <button 
//                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
//                 className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
//               >
//                 <Bell className="h-5 w-5" />
//                 {/* Active Notification Badge */}
//                 <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
//               </button>

//               {isNotificationsOpen && (
//                 <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-950">
//                   <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
//                     <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</span>
//                   </div>
//                   <div className="max-h-64 overflow-y-auto">
//                     {notifications.map((n) => (
//                       <div key={n.id} className={`flex flex-col gap-0.5 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer ${n.unread ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''}`}>
//                         <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.text}</p>
//                         <span className="text-xs text-slate-400">{n.time}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* User Profile Dropdown */}
//             <div className="relative" ref={profileRef}>
//               <button 
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 className="flex items-center gap-2 rounded-xl p-0.5 focus:outline-none"
//               >
//                 <img 
//                   className="h-9 w-9 rounded-xl border border-slate-200 object-cover dark:border-slate-700" 
//                   src="https://unsplash.com" 
//                   alt="Avatar" 
//                 />
//               </button>

//               {isProfileOpen && (
//                 <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-950">
//                   <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
//                     <p className="text-sm font-semibold text-slate-900 dark:text-white">Alisha Sen</p>
//                     <p className="text-xs text-slate-400">alisha@taskflow.com</p>
//                   </div>
//                   <div className="mt-1">
//                     <a href="#profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">
//                       <User className="h-4 w-4 text-slate-400" /> Account Details
//                     </a>
//                     <a href="#settings" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">
//                       <Settings className="h-4 w-4 text-slate-400" /> App Settings
//                     </a>
//                     <hr className="my-1 border-slate-100 dark:border-slate-800" />
//                     <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30">
//                       <LogOut className="h-4 w-4" /> Disconnect / Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>

//           {/* MOBILE MENU TOGGLE BUTTON */}
//           <div className="flex md:hidden items-center">
//             <button 
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* MOBILE CONTAINER DROPDOWN */}
//       {isMobileMenuOpen && (
//         <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-4 shadow-lg md:hidden dark:border-slate-800 dark:bg-slate-900">
//           <div className="flex flex-col gap-1">
//             <a href="#dashboard" className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-base font-medium text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
//               <LayoutDashboard className="h-5 w-5" /> Dashboard
//             </a>
//             <a href="#tasks" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
//               <ListTodo className="h-5 w-5" /> My Tasks
//             </a>
//             <a href="#calendar" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
//               <Calendar className="h-5 w-5" /> Calendar
//             </a>
//             <hr className="my-2 border-slate-200 dark:border-slate-800" />
            
//             {/* Mobile Create Button */}
//             <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500">
//               <Plus className="h-5 w-5" /> Create Task
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Bell,
  Menu,
  X,
  Plus,
  LayoutDashboard,
  ListTodo,
  Calendar,
  Settings,
  LogOut,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';
import api from '../services/axiosConfig';

export default function Navbar() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock Data for Task Notifications
  const notifications = [
    { id: 1, text: "Task 'API Integration' is overdue", time: "2m ago", unread: true },
    { id: 2, text: "Rahul assigned you a new task", time: "1h ago", unread: true },
    { id: 3, text: "Database migration completed", time: "Yesterday", unread: false },
  ];

  // Handle logout
  const handleLogout = async() => {
    // logic to clear user session, tokens, etc.
    await api.get('/auth/v1/logout/user'); // Call backend logout endpoint
    dispatch(logout());
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Logo & Main Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                <CheckSquare className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Task<span className="text-indigo-600">Flow</span>
              </span>
            </Link>

            {/* Desktop Navigation Links (Only for logged-in users) */}
            {user && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <ListTodo className="h-4 w-4" /> My Tasks
                </Link>
                <Link
                  to="/calendar"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Calendar className="h-4 w-4" /> Calendar
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT: Quick Actions & Profile (Only for logged-in users) */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              {/* Quick Action Button: Create Task */}
              <Link
                to="/create-task"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-200 active:scale-95 dark:shadow-none"
              >
                <Plus className="h-4 w-4" /> Create Task
              </Link>

              {/* Notification Bell Dropdown */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Bell className="h-5 w-5" />
                  {/* Active Notification Badge */}
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-950">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Notifications
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex flex-col gap-0.5 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer ${
                            n.unread ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {n.text}
                          </p>
                          <span className="text-xs text-slate-400">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-xl p-0.5 focus:outline-none"
                >
                  <img
                    className="h-9 w-9 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                    src={user?.avatar || "https://i.pravatar.cc/150?u=default"}
                    alt="Avatar"
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-950">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <div className="mt-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4 text-slate-400" /> Account Details
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4 text-slate-400" /> App Settings
                      </Link>
                      <hr className="my-1 border-slate-100 dark:border-slate-800" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                      >
                        <LogOut className="h-4 w-4" /> Disconnect / Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Show Login/Register buttons for non-logged-in users
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                <UserPlus className="h-4 w-4" /> Register
              </Link>
            </div>
          )}

          {/* MOBILE MENU TOGGLE BUTTON */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE CONTAINER DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-4 shadow-lg md:hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-base font-medium text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" /> Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ListTodo className="h-5 w-5" /> My Tasks
                </Link>
                <Link
                  to="/calendar"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="h-5 w-5" /> Calendar
                </Link>
                <hr className="my-2 border-slate-200 dark:border-slate-800" />
                <Link
                  to="/create-task"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Plus className="h-5 w-5" /> Create Task
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-base font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-base font-medium text-white shadow-sm hover:bg-indigo-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5" /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}