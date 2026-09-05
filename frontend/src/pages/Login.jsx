import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import api from '../services/axiosConfig'
import { useNavigate } from 'react-router-dom';



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear errors as user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Form Validation and Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock API Submission State
    try {
      setIsLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 1500)); // Network simulation
      console.log('Form submitted:', formData);
      // Call backend API to register user
      // const data = new FormData();
      // data.append('email', formData.email);
      // data.append('password', formData.password);
      // If you have a file input for avatar, you can append it here as well
      // data.append('avatar', formData.avatarFile);
      const response = await api.post('/auth/v1/login/user', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("After login response :", response.data);
      console.log("user data :", response.data.data);
      dispatch(login(response.data.data));
      navigate('/dashboard'); // Redirect to dashboard upon successful login
      alert('Logged in successfully!');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-200">
      
      {/* BACKGROUND GRAPHICS: Modern Blurred Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-200/50 blur-[80px] dark:bg-indigo-900/20" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[45%] w-[45%] rounded-full bg-violet-200/50 blur-[100px] dark:bg-violet-900/20" />

      {/* CORE LOGIN CARD */}
      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <a href="#signup" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Create one for free
            </a>
          </p>
        </div>

        {/* Social Authentication Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="inline-flex w-full justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/50 transition-colors">
            {/* <ChromeIcon className="h-4 w-4 text-rose-500" /> */}
            <span>Google</span>
          </button>
          <button type="button" className="inline-flex w-full justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/50 transition-colors">
            {/* <Github className="h-4 w-4" /> */}
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <span className="relative bg-white px-4 text-xs uppercase tracking-wider text-slate-400 dark:bg-slate-900">
            Or continue with
          </span>
        </div>

        {/* Credentials Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* EMAIL FIELD */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border pl-10 pr-3 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs font-medium text-rose-500">{errors.email}</p>}
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.password
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs font-medium text-rose-500">{errors.password}</p>}
            </div>
          </div>

          {/* REMEMBER ME & FORGOT PASSWORD BOX */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 select-none">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#forgot" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Forgot password?
              </a>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign in to account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
