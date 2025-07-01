import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ setLoggedInUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form);

      const { token, username, avatarUrl } = res.data;

      if (!token || !username) {
        alert("Login response incomplete");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("avatarUrl", avatarUrl || `https://ui-avatars.com/api/?name=${username}`);
      setLoggedInUser && setLoggedInUser({ username, avatarUrl });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert("Login failed: Invalid credentials or server error");
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

      navigate('/dashboard');
    } catch (err) {
      console.error("Google Login failed", err);
      alert("Google login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="mb-2 w-full p-2 border"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="mb-4 w-full p-2 border"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">or</div>

        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google login failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
