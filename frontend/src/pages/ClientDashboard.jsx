import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { PlusCircle, Briefcase, CheckCircle, Clock } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`/api/projects?client=${user._id}`, config);
        setProjects(data.data);
      } catch (error) {
        console.error('Error fetching projects', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProjects();
  }, [user]);

  const activeProjects = projects.filter(p => p.status === 'open' || p.status === 'in-progress');
  const completedProjects = projects.filter(p => p.status === 'completed');

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome back, {user.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what's happening with your projects today.</p>
        </div>
        <Link to="/projects/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md transition">
          <PlusCircle size={20} className="mr-2" /> Post a Project
        </Link>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
            <Briefcase className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Projects</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{projects.length}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mr-4">
            <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active Projects</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{activeProjects.length}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Completed Projects</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{completedProjects.length}</h3>
          </div>
        </div>
      </div>

      {/* My Projects */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Your Recent Projects</h2>
        {projects.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-10 rounded-xl text-center border border-slate-100 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't posted any projects yet.</p>
            <Link to="/projects/create" className="text-indigo-600 hover:text-indigo-800 font-medium">Create your first project</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.slice(0, 4).map(project => (
              <ProjectCard key={project._id} project={project} role="client" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
