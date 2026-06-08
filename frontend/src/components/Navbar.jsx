import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow dark:bg-slate-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              FreelanceHub
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {(!user || user.role === 'freelancer') && (
              <Link to="/projects" className="text-gray-700 hover:text-indigo-600 dark:text-gray-200">
                Find Work
              </Link>
            )}
            {(!user || user.role === 'client') && (
              <Link to="/freelancers" className="text-gray-700 hover:text-indigo-600 dark:text-gray-200">
                Find Talent
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/settings" className="text-gray-700 hover:text-indigo-600 dark:text-gray-200">
                  Settings
                </Link>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : `/${user.role}/dashboard`} className="flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600">
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2 border border-gray-300 object-cover" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="flex items-center text-red-500 hover:text-red-700 transition"
                >
                  <LogOut size={18} className="mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 dark:text-gray-200">
                  Log In
                </Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition shadow-md font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            {user && (
              <button 
                onClick={logout} 
                className="text-red-500 hover:text-red-700 transition p-2 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
