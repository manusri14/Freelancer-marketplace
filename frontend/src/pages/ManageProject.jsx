import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Calendar, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const ManageProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchProjectAndProposals = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch project details
        const projectRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, config);
        setProject(projectRes.data.data);

        // Fetch proposals for this project
        const proposalsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${id}/proposals`, config);
        setProposals(proposalsRes.data.data);

      } catch (err) {
        setError('Failed to load project details or proposals.');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'client') {
      fetchProjectAndProposals();
    }
  }, [id, user]);

  const handleUpdateProposal = async (proposalId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Update proposal status
      await axios.put(`${import.meta.env.VITE_API_URL}/api/proposals/${proposalId}/status`, { status }, config);
      
      // Update local state
      setProposals(proposals.map(p => p._id === proposalId ? { ...p, status } : p));
      
      // If accepted, update project status locally AND in DB
      if (status === 'accepted') {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, { status: 'in-progress' }, config);
        setProject({ ...project, status: 'in-progress' });
      }

    } catch (err) {
      console.error('Failed to update proposal', err);
      alert('Failed to update proposal status.');
    }
  };

  const handleCompleteProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, { status: 'completed' }, config);
      setProject({ ...project, status: 'completed' });
    } catch (err) {
      console.error('Failed to complete project', err);
      alert('Failed to update project status.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return alert("Please enter a review.");
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const hiredProposal = proposals.find(p => p.status === 'accepted');
      if (!hiredProposal) return alert("No hired freelancer found.");

      const reviewData = {
        project: id,
        freelancer: hiredProposal.freelancer._id,
        rating,
        review: reviewText
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, reviewData, config);
      setReviewSubmitted(true);
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Failed to submit review', err);
      alert(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (!user || user.role !== 'client') return <div className="text-center py-10 md:py-20">Access Denied. Only clients can manage projects.</div>;
  if (loading) return <div className="text-center py-10 md:py-20">Loading project management...</div>;
  if (error || !project) return <div className="text-center py-10 md:py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Manage Project</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review proposals and manage "{project.title}"</p>
        </div>
        <Link to="/client/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Snapshot */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Project Snapshot</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</span>
                <p className="font-medium text-slate-800 dark:text-white mt-1">
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'open' ? 'bg-green-100 text-green-800' : 
                    project.status === 'completed' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status.toUpperCase()}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Budget</span>
                <p className="font-medium text-slate-800 dark:text-white mt-1">${project.budget}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Deadline</span>
                <p className="font-medium text-slate-800 dark:text-white mt-1">{new Date(project.deadline).toLocaleDateString()}</p>
              </div>
              
              {project.status === 'in-progress' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={handleCompleteProject}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}

              {project.status === 'completed' && !reviewSubmitted && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-white mb-3">Leave a Review</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Rating (1-5)</label>
                      <select 
                        value={rating} 
                        onChange={e => setRating(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {[5, 4, 3, 2, 1].map(num => (
                          <option key={num} value={num}>{num} Stars</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Feedback</label>
                      <textarea 
                        value={reviewText} 
                        onChange={e => setReviewText(e.target.value)}
                        rows="3"
                        placeholder="How was working with this freelancer?"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm">
                      Submit Review
                    </button>
                  </form>
                </div>
              )}

              {reviewSubmitted && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg text-sm text-center font-medium border border-green-200 dark:border-green-800">
                    Review successfully submitted!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Proposals List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Proposals ({proposals.length})</h2>
          
          {proposals.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">No proposals received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map(proposal => (
                <div key={proposal._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <img src={proposal.freelancer?.avatar} alt={proposal.freelancer?.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{proposal.freelancer?.name}</h4>
                        <div className="text-sm text-yellow-500">★ {proposal.freelancer?.rating || 'New'} ({proposal.freelancer?.numReviews || 0} reviews)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-indigo-600 dark:text-indigo-400">${proposal.bidAmount}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{proposal.deliveryTime} delivery</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg mb-4">
                    <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Cover Letter</h5>
                    <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{proposal.coverLetter}</p>
                  </div>

                  {project.status === 'open' && proposal.status === 'pending' ? (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleUpdateProposal(proposal._id, 'accepted')}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition flex justify-center items-center"
                      >
                        <CheckCircle size={18} className="mr-2" /> Accept & Hire
                      </button>
                      <button 
                        onClick={() => handleUpdateProposal(proposal._id, 'rejected')}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 py-2 rounded-lg font-medium transition flex justify-center items-center"
                      >
                        <XCircle size={18} className="mr-2" /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 mt-2">
                      <div className="text-center">
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                          proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                          proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          STATUS: {proposal.status.toUpperCase()}
                        </span>
                      </div>
                      {proposal.status === 'accepted' && (
                        <Link 
                          to={`/chat/${proposal.freelancer._id}`}
                          className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition mt-2 block"
                        >
                          Chat with Freelancer
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProject;
