import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Users, Briefcase, DollarSign, Star, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [analyticsRes, usersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, config)
        ]);

        setAnalytics(analyticsRes.data.data);
        setUsers(usersRes.data.data);
      } catch (error) {
        console.error('Error fetching admin data', error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'admin') fetchAdminData();
  }, [user]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, config);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        console.error('Error deleting user', error);
      }
    }
  };

  if (loading) return <div className="text-center py-10 md:py-20">Loading admin dashboard...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Platform overview and management.</p>
      </div>

      {/* Analytics Widgets */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{analytics.users.total}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
              <Briefcase className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Projects</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{analytics.projects.total}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mr-4">
              <DollarSign className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Budget Volume</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">${analytics.totalBudgetVolume}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg mr-4">
              <Star className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Reviews</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{analytics.reviews}</h3>
            </div>
          </div>
        </div>
      )}

      {/* User Management */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Manage Users</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Email</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Role</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Joined</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <td className="py-4 px-6 flex items-center">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full mr-3" />
                    <span className="font-medium text-slate-800 dark:text-white">{u.name}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      u.role === 'client' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    {u._id !== user._id && (
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-500 hover:text-red-700 transition flex items-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
