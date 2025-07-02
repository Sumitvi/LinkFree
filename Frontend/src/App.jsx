import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicPage from './pages/PublicPage';
import Login from './pages/Login';
import Register from './pages/Register';

import DashboardLayout from './components/DashboardLayout';
import MyLinks from './pages/MyLinks';
import AddLinkPage from './pages/AddLinkPage'; 
import Settings from './pages/Settings';     
import DashboardContacts from './components/DashboardContacts';  
import ProtectedLinks from './pages/ProtectedLinks'; 
import Shortener from './pages/Shortener';
import AuthGuard from './components/AuthGuard';
import OAuth2Success from './components/OAuth2Success ';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/u/:username" element={<PublicPage />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />


        {/* Protected Dashboard Routes using AuthGuard */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }>
          <Route index element={<MyLinks />} />
          <Route path="add" element={<AddLinkPage />} />
          <Route path="contacts" element={<DashboardContacts />} />
          <Route path="protected-links" element={<ProtectedLinks />} />
          <Route path="shorten" element={<Shortener />} />
          <Route path="settings" element={<Settings />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
