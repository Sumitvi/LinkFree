import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', form);
      setSuccess("✅ Registered successfully!");
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Registration failed");
      setSuccess('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full p-2 border" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border" />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
