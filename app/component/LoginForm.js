"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { login } from './auth';
import { Toaster, toast } from 'sonner';

const LoginForm = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate inputs
    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast.error('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    // Add a small delay for better UX
    setTimeout(() => {
      const result = login(credentials.username.trim(), credentials.password);
      
      if (result.success) {
        toast.success(`Welcome back, ${credentials.username}! Redirecting to admin panel...`, {
          duration: 2000,
        });
        setLoginAttempts(0);
        // Small delay before calling onLoginSuccess to show the success message
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        setLoginAttempts(prev => prev + 1);
        
        // Enhanced error messages
        if (loginAttempts >= 2) {
          toast.error('Multiple failed attempts. Please check your credentials carefully.', {
            duration: 4000,
          });
        } else {
          toast.error('Invalid username or password. Please try again.', {
            duration: 3000,
          });
        }
        
        // Clear password on failed attempt for security
        setCredentials(prev => ({
          ...prev,
          password: ''
        }));
        
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-right" richColors />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-800 rounded-full flex items-center justify-center mb-4">
            <FiLock className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🔆 Nzeoma Solar
          </h1>
          <p className="text-gray-600">Admin Panel Access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiUser size={20} />
              </div>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter username"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiLock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !credentials.username || !credentials.password}
            className="w-full bg-green-800 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-green-600 transition-all duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Signing In...
              </div>
            ) : (
              'Sign In to Admin Panel'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-3">
            Secure access to Nzeoma Solar admin dashboard
          </p>
          
          
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;