import React, { useState } from 'react';
import axios from 'axios';
import FlashMessage from '../components/FlashMessage'; // adjust path if needed

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [flash, setFlash] = useState({ message: '', type: '' });

  const showFlash = (message, type = 'success') => {
    setFlash({ message, type });
    setTimeout(() => setFlash({ message: '', type: '' }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      showFlash("Username is required", "error");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      showFlash("Please enter a valid email like example@gmail.com", "error");
      return false;
    }
    if (form.password.length < 4) {
      showFlash("Password must be at least 4 characters", "error");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', form);
      showFlash("✅ Registered successfully!", "success");
    } catch (err) {
      console.error(err);
      showFlash(err.response?.data || "Registration failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      {/* Flash Message */}
      <FlashMessage
        message={flash.message}
        type={flash.type}
        onClose={() => setFlash({ message: '', type: '' })}
      />

      <div className="w-full max-w-sm sm:max-w-md space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://bcassetcdn.com/public/blog/wp-content/uploads/2023/02/28141228/orange-abstract-letter-a-by-bryad-brandcrowd.png"
            alt="LinkFree Logo"
            className="h-10 sm:h-12"
          />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">
            Create Your LinkFree Account
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">
            Manage all your links from one profile
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4 text-left px-2 sm:px-0">
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-orange-600 font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
