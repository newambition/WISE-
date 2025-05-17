import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    // Placeholder for backend login logic
    alert('Login logic would go here.');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Placeholder for backend signup logic
    alert('Signup logic would go here.');
  };

  const closeAndReset = () => {
    setForm({ username: '', password: '', confirmPassword: '' });
    setError('');
    setMode('login');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-base-200 border-border-color text-black border-2 backdrop-blur-lg rounded-lg shadow-xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-black hover:text-base-content text-xl"
          onClick={closeAndReset}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </h2>
        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-black">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-black">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
              required
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="block mb-1 font-medium text-black">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
                required
              />
            </div>
          )}
          {error && <div className="text-error text-sm">{error}</div>}
          <div className="flex flex-col gap-3 mt-6">
            {mode === 'login' ? (
              <>
                <button type="submit" className="btn btn-primary w-full">Log In</button>
                <button
                  type="button"
                  className="btn btn-outline w-full"
                  onClick={() => setMode('signup')}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button type="submit" className="btn btn-primary w-full">Sign Up</button>
                <button
                  type="button"
                  className="btn btn-outline w-full"
                  onClick={() => setMode('login')}
                >
                  Back to Login
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal; 