import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const navItemClass = ({ isActive }) => `
    flex items-center px-4 py-3 my-1 rounded-lg transition-colors
    ${isActive 
      ? 'bg-activeMenu text-white' 
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
  `;

  return (
    <div className="w-64 bg-adminBg min-h-screen flex flex-col border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-extrabold text-activeMenu">Admin Portal</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavLink to="/admin/dashboard" className={navItemClass}>
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/events" className={navItemClass}>
          <Calendar className="w-5 h-5 mr-3" />
          Manage Events
        </NavLink>
        <NavLink to="/admin/participants" className={navItemClass}>
          <Users className="w-5 h-5 mr-3" />
          Participants
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
