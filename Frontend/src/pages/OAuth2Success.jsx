import { useEffect } from 'react';
import {refreshAuthHeader} from '../services/api'; 

const OAuth2Success = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');

    if (token && username) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      refreshAuthHeader(); 

    
      window.location.href = '/dashboard';
    } else {
      console.error('Token or username missing from query params');
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default OAuth2Success;
