import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/users/freelancers${keyword ? `?keyword=${keyword}` : ''}`, config);
        setFreelancers(data.data);
      } catch (error) {
        console.error('Error fetching freelancers', error);
      } finally {
        setLoading(false);
      }
    };
    // Implement debounce for searching
    const delayDebounceFn = setTimeout(() => {
      fetchFreelancers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Find Talent</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Browse top rated freelancers.</p>
        </div>
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search by name or skills..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading freelancers...</div>
      ) : freelancers.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-xl text-center border border-slate-100 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No freelancers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map(freelancer => (
            <div key={freelancer._id} className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700 p-6 flex flex-col items-center text-center">
              <img src={freelancer.avatar} alt={freelancer.name} className="w-24 h-24 rounded-full mb-4 object-cover" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{freelancer.name}</h3>
              <div className="flex items-center text-yellow-500 mb-4">
                <Star size={16} className="fill-current" />
                <span className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {freelancer.rating || 0} ({freelancer.numReviews || 0} reviews)
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {freelancer.skills && freelancer.skills.map((skill, index) => (
                  <span key={index} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <Link to={`/freelancers/${freelancer._id}`} className="w-full text-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 py-2 rounded-lg transition font-medium block">
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Freelancers;
