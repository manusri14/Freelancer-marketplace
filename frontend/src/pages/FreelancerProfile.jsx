import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Mail, Briefcase, Award } from 'lucide-react';

const FreelancerProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/users/${id}`);
        setProfile(data.data);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (error || !profile) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/freelancers" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          &larr; Back to Find Talent
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700 overflow-hidden mb-8">
        {/* Banner */}
        <div className="h-32 bg-indigo-600 w-full"></div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-6">
            <div className="flex items-end">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-slate-800 object-cover bg-white" 
              />
              <div className="ml-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{profile.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Freelancer</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
               <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition font-medium">
                 Invite to Job
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">About Me</h2>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {profile.bio || "This freelancer hasn't written a bio yet."}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? profile.skills.map((skill, index) => (
                    <span key={index} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium text-sm">
                      {skill}
                    </span>
                  )) : <p className="text-slate-500 italic">No skills listed.</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Overview</h3>
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center">
                    <Star className="text-yellow-500 mr-3" size={18} /> 
                    <span className="font-medium text-slate-800 dark:text-white mr-1">{profile.rating || 0}</span> 
                    ({profile.numReviews || 0} reviews)
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-indigo-500 mr-3" size={18} /> 
                    Contact via Chat
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="text-indigo-500 mr-3" size={18} /> 
                    Completed Jobs: {profile.numReviews || 0}
                  </div>
                  <div className="flex items-center">
                    <Award className="text-indigo-500 mr-3" size={18} /> 
                    Member since {new Date(profile.createdAt).getFullYear()}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
