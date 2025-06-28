import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import PublicPage from './pages/PublicPage';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import MyLinks from './pages/MyLinks';
import AddLinkPage from './pages/AddLinkPage'; 
import Settings from './pages/Settings';     
import DashboardContacts from './components/DashboardContacts';  
import DashboardQrPage from './pages/DashboardQrPage';
// import Dashboard from './pages/Dashboard';



function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/u/:username" element={<PublicPage />} />
        <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />

        {/* Dashboard Routes (Protected) */}
        <Route path="/dashboard" element={
          loggedInUser ? <DashboardLayout /> : <Navigate to="/login" />
        }>
          <Route index element={<MyLinks />} />
          <Route path="add" element={<AddLinkPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="contacts" element={<DashboardContacts />} />
          <Route path="/dashboard/qr" element={<DashboardQrPage />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
