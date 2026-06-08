import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Calendar, DollarSign, Clock, MapPin, User as UserIcon } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Proposal State
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [proposalStatus, setProposalStatus] = useState(''); // '' | 'loading' | 'success' | 'error'
  const [proposalError, setProposalError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
        setProject(data.data);
      } catch (err) {
        setError('Project not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setProposalStatus('loading');
    setProposalError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/projects/${id}/proposals`, {
        bidAmount,
        deliveryTime,
        coverLetter
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposalStatus('success');
    } catch (err) {
      setProposalStatus('error');
      setProposalError(err.response?.data?.message || 'Failed to submit proposal.');
    }
  };

  if (loading) return <div className="text-center py-10 md:py-20">Loading project details...</div>;
  if (error || !project) return <div className="text-center py-10 md:py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{project.title}</h1>
              <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full">
                {project.status.toUpperCase()}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
              <div className="flex items-center"><Briefcase size={16} className="mr-2 text-indigo-500" /> {project.category}</div>
              <div className="flex items-center"><Calendar size={16} className="mr-2 text-indigo-500" /> Posted {new Date(project.createdAt).toLocaleDateString()}</div>
              <div className="flex items-center"><Clock size={16} className="mr-2 text-indigo-500" /> Deadline: {new Date(project.deadline).toLocaleDateString()}</div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Project Description</h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {project.description}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((skill, index) => (
                  <span key={index} className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Proposal Form for Freelancers */}
          {user && user.role === 'freelancer' && project.status === 'open' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Submit a Proposal</h2>
              
              {proposalStatus === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-lg text-center">
                  <h3 className="font-bold text-lg mb-2">Proposal Submitted!</h3>
                  <p>Your proposal has been sent to the client. You can track its status in your dashboard.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  {proposalError && <div className="text-red-500 text-sm">{proposalError}</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bid Amount ($)</label>
                      <input 
                        type="number" 
                        required 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Estimated Delivery</label>
                      <input 
                        type="text" 
                        required 
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="e.g. 2 weeks"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cover Letter</label>
                    <textarea 
                      required 
                      rows="6"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="Why are you the best fit for this project?"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={proposalStatus === 'loading'}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {proposalStatus === 'loading' ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Budget Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Project Budget</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white flex items-center">
              <DollarSign size={28} className="text-indigo-500 mr-1" /> {project.budget}
            </div>
          </div>

          {/* Client Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">About the Client</h3>
            <div className="flex items-center mb-4">
              <img src={project.client?.avatar} alt="Client" className="w-16 h-16 rounded-full mr-4 border-2 border-slate-100 dark:border-slate-700" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">{project.client?.name}</h4>
                <div className="flex items-center text-yellow-500 text-sm mt-1">
                  ★ {project.client?.rating || 'New'} ({project.client?.numReviews || 0} reviews)
                </div>
              </div>
            </div>
            
            {!user && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Sign in to submit a proposal for this project.</p>
                <Link to="/login" className="block w-full text-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium py-2 rounded-lg transition">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProjectDetails;
