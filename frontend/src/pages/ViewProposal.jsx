import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Clock, DollarSign, Calendar } from 'lucide-react';

const ViewProposal = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // We only have a get all proposals route, so we filter it here
        // (A dedicated get single proposal backend route is ideal, but this works)
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposals`, config);
        const myProposal = data.data.find(p => p._id === id);
        
        if (myProposal) {
          setProposal(myProposal);
        } else {
          setError('Proposal not found or you do not have permission.');
        }
      } catch (err) {
        setError('Failed to load proposal details.');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'freelancer') {
      fetchProposal();
    }
  }, [id, user]);

  if (!user || user.role !== 'freelancer') return <div className="text-center py-20">Access Denied.</div>;
  if (loading) return <div className="text-center py-20">Loading proposal...</div>;
  if (error || !proposal) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Proposal Details</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">For project: <Link to={`/projects/${proposal.project._id}`} className="text-indigo-600 hover:underline">{proposal.project.title}</Link></p>
        </div>
        <Link to="/freelancer/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
        
        <div className="flex flex-wrap gap-6 mb-8 border-b border-slate-100 dark:border-slate-700 pb-8">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {proposal.status.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1 flex items-center"><DollarSign size={14} className="mr-1"/> Bid Amount</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">${proposal.bidAmount}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1 flex items-center"><Clock size={14} className="mr-1"/> Delivery Time</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{proposal.deliveryTime}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1 flex items-center"><Calendar size={14} className="mr-1"/> Submitted On</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{new Date(proposal.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Your Cover Letter</h3>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{proposal.coverLetter}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewProposal;
