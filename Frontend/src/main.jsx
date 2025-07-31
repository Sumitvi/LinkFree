import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

import axios from 'axios'


const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="794783146331-k0bk90qsqscotqook1vekp363oe11tcq.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>

)
