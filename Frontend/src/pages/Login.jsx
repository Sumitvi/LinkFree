import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import FlashMessage from '../components/FlashMessage'; // adjust path if needed

const Login = ({ setLoggedInUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [flash, setFlash] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const showFlash = (message, type = 'success') => {
    setFlash({ message, type });
    setTimeout(() => setFlash({ message: '', type: '' }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form);
      const { token, username, avatarUrl } = res.data;

      if (!token || !username) {
        showFlash("Login response incomplete", "error");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("avatarUrl", avatarUrl || `https://ui-avatars.com/api/?name=${username}`);
      setLoggedInUser && setLoggedInUser({ username, avatarUrl });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      showFlash("Login successful", "success");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      showFlash("Login failed: Invalid credentials or server error", "error");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/google', {
        token: credentialResponse.credential,
      });

      const { jwtToken, username, avatarUrl } = res.data;

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("username", username);
      localStorage.setItem("avatarUrl", avatarUrl || `https://ui-avatars.com/api/?name=${username}`);
      setLoggedInUser && setLoggedInUser({ username, avatarUrl });
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

      showFlash("Google Login successful", "success");
      navigate('/dashboard');
    } catch (err) {
      console.error("Google Login failed", err);
      showFlash("Google login failed", "error");
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
            alt="Chanakya AI Logo"
            className="h-10 sm:h-12"
          />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">
            LinkFree Your Link Own Manager
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">
              Manage all your links, customize your style, and track every click          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left px-2 sm:px-0">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* <div className="text-right text-sm">
            <a href="#" className="text-orange-600 hover:underline">Forgot Password?</a>
          </div> */}

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Sign up */}
        <p className="text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-orange-600 font-semibold hover:underline">Sign up</a>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <hr className="flex-grow border-gray-300" />
          OR
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => showFlash("Google login failed", "error")}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
