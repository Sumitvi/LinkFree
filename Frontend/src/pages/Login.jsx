import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setLoggedInUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form, {
        withCredentials: true,
      });

      const user = res.data;
      console.log("Login Response:", user); // Debug

      // Ensure required fields are present
      if (!user.username) {
        alert("Login succeeded but username is missing in response");
        return;
      }

      // Store username and user info
      localStorage.setItem("username", user.username);
      setLoggedInUser(user);

      navigate('/dashboard');
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
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
    </div>
  );
};

export default Login;
