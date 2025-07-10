import { useEffect } from 'react';
import {refreshAuthHeader} from '../services/api'; // Import the function to refresh auth header

const OAuth2Success = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');

    if (token && username) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      refreshAuthHeader(); // ✅ Ensure axios has token for all future requests

      // Redirect to dashboard after saving details
      window.location.href = '/dashboard';
    } else {
      console.error('Token or username missing from query params');
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default OAuth2Success;
