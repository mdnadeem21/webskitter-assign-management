import React, { useState, useRef } from 'react';
import { User, Phone, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, Camera } from 'lucide-react';
import { Link, useNavigate  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../store/userSlice';
import api from '../services/axiosConfig'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    rememberMe: false,
    avatar: null, // For storing the file
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null); // For previewing the uploaded avatar
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === 'avatar') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));

      // Create a preview URL for the avatar
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
      } else {
        setAvatarPreview(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear errors as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation and submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    // if (!formData.confirmPassword) {
    //   newErrors.confirmPassword = 'Please confirm your password';
    // } else if (formData.password !== formData.confirmPassword) {
    //   newErrors.confirmPassword = 'Passwords do not match';
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock API submission
    try {
      setIsLoading(true);

      // Create FormData for file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('phone', formData.phone);
      if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      // Call backend API to register user
      const response = await api.post('/auth/v1/register/user', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
       // Dispatch register action to update Redux state
      console.log('Api response :', response.data.data);
      
      dispatch(register(response.data.data));
      alert('Registration successful! Please log in.');
      // reset form after successful submission
      navigate('/login');
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle avatar removal
  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: null }));
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-200">
      {/* Background Graphics: Modern Blurred Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-200/50 blur-[80px] dark:bg-indigo-900/20" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[45%] w-[45%] rounded-full bg-violet-200/50 blur-[100px] dark:bg-violet-900/20" />

      {/* Core Registration Card */}
      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Sign in
            </Link>
          </p>
        </div>

        {/* Social Authentication Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/50 transition-colors"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/50 transition-colors"
          >
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <span className="relative bg-white px-4 text-xs uppercase tracking-wider text-slate-400 dark:bg-slate-900">
            Or sign up with
          </span>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* NAME FIELD */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border pl-10 pr-3 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.name
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs font-medium text-rose-500">{errors.name}</p>}
            </div>

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
                  autoComplete="new-password"
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

            {/* PHONE FIELD */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Phone
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  autoComplete="new-password"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.phone
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                  placeholder="+91 9999999999"
                />
                {/* <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button> */}
              </div>
              {errors.phone && <p className="mt-1 text-xs font-medium text-rose-500">{errors.phone}</p>}
            </div>

            {/* AVATAR UPLOAD FIELD */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Profile Picture
              </label>
              <div className="mt-1 flex items-center gap-4">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs hover:bg-rose-600"
                    >
                      ×
                    </button>
                  )}
                </div>
                <label
                  htmlFor="avatar"
                  className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Choose File
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
              {errors.avatar && <p className="mt-1 text-xs font-medium text-rose-500">{errors.avatar}</p>}
            </div>
          </div>

          {/* TERMS AND CONDITIONS CHECKBOX */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="rememberMe" className="text-slate-600 dark:text-slate-400 select-none">
                I agree to the{' '}
                <a href="#terms" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}