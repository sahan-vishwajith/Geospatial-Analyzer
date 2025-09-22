// src/components/Registration.tsx
import React, { useState } from 'react';
import { registerUser } from './fakeAuth';

interface RegistrationProps {
  onShowLogin: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onShowLogin }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = registerUser(username, email, password);
    if (result.success) {
      alert(result.message);
      onShowLogin();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-white text-center">Register</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="w-full pl-2 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full pl-2 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full pl-2 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            required
          />
          <input
            name="confirm-password"
            type="password"
            placeholder="Confirm Password"
            className="w-full pl-2 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            required
          />
          {error && <p className="text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md"
          >
            Register
          </button>
        </form>
        <p className="text-gray-400 text-center">
          Already have an account?{' '}
          <button onClick={onShowLogin} className="text-cyan-400 hover:text-cyan-300">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Registration;
