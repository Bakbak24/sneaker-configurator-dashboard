import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch(
        'https://sneaker-configurator-backend.onrender.com/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        const decodedToken = JSON.parse(atob(data.data.token.split('.')[1]));
        if (decodedToken.role !== 'admin') {
          setErrorMessage('Access denied. Only admins can log in.');
          return;
        }

        localStorage.setItem('token', data.data.token);
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'Invalid login credentials.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white text-black p-8 shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <img src="/swear-logo.png" alt="Swear London Logo" className="w-52 h-auto" />
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter your username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-sm"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 px-4 border border-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Login
          </Button>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;