import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Briefcase, DollarSign, Star, Send } from 'lucide-react';

const FreelancerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposals`, config);
        setProposals(data.data);
      } catch (error) {
        console.error('Error fetching proposals', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProposals();
  }, [user]);

  const acceptedProposals = proposals.filter(p => p.status === 'accepted');
  const pendingProposals = proposals.filter(p => p.status === 'pending');

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome back, {user.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is the status of your work and proposals.</p>
        </div>
        <Link to="/projects" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md transition">
          <Briefcase size={20} className="mr-2" /> Find Work
        </Link>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg mr-4">
            <Send className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Proposals</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{proposals.length}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mr-4">
            <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending Bids</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{pendingProposals.length}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
            <Briefcase className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active Jobs</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{acceptedProposals.length}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg mr-4">
            <Star className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Rating</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{user.rating || 0} / 5</h3>
          </div>
        </div>
      </div>

      {/* My Proposals */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Recent Proposals</h2>
        {proposals.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-10 rounded-xl text-center border border-slate-100 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't submitted any proposals yet.</p>
            <Link to="/projects" className="text-indigo-600 hover:text-indigo-800 font-medium">Browse Projects</Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Project</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Bid Amount</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {proposals.slice(0, 5).map(proposal => (
                  <tr key={proposal._id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <td className="py-4 px-6">
                      <Link to={`/projects/${proposal.project._id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                        {proposal.project.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800 dark:text-white">${proposal.bidAmount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        proposal.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {proposal.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 flex flex-col gap-2">
                      <Link to={`/proposals/${proposal._id}`} className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-medium text-sm">
                        View
                      </Link>
                      {proposal.status === 'accepted' && (
                        <Link to={`/chat/${proposal.project.client}`} className="text-blue-500 hover:text-blue-700 font-medium text-sm">
                          Chat
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Also needed to import Clock for pending widget
import { Clock } from 'lucide-react';

export default FreelancerDashboard;
