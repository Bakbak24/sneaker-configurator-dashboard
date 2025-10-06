import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ChangePasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const navigate = useNavigate();

  const decodeUserId = (): string | null => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.uid;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset all error messages
    setErrorNewPassword('');
    setErrorConfirmPassword('');
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validations
    if (!newPassword) {
      setErrorNewPassword('New password is required.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorNewPassword('New password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setErrorNewPassword('New password must contain at least one uppercase letter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorConfirmPassword('Passwords do not match.');
      return;
    }

    const userId = decodeUserId();
    if (!userId) {
      setErrorMessage('User ID not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        'https://sneaker-configurator-backend.onrender.com/users/updatePassword',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            userId,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMessage('Password changed successfully.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setErrorMessage(data.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      
      {/* Change password form */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 shadow-lg max-w-sm w-full rounded">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Change Password</h1>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="Enter your new password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-sm"
              />
              {errorNewPassword && (
                <p className="text-red-500 text-sm mt-1">{errorNewPassword}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm your new password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-sm"
              />
              {errorConfirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errorConfirmPassword}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white font-semibold py-3 px-4 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
            >
              Change Password
            </Button>
          </form>
          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mt-4">{successMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;