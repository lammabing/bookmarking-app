import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose, onAuth }) => {
  const [activeForm, setActiveForm] = useState('login'); // 'login' or 'register'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {activeForm === 'login' ? 'Login' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {activeForm === 'login' ? (
          <LoginForm
            onLogin={(user) => {
              onAuth(user);
              onClose();
            }}
            onSwitchToRegister={() => setActiveForm('register')}
          />
        ) : (
          <RegisterForm
            onRegister={(user) => {
              onAuth(user);
              onClose();
            }}
            onSwitchToLogin={() => setActiveForm('login')}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;