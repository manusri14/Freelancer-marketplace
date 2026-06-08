import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { Search } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        let url = `${import.meta.env.VITE_API_URL}/api/projects?status=open`;
        if (keyword) url += `&title[regex]=${keyword}&title[options]=i`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        
        const { data } = await axios.get(url);
        setProjects(data.data);
      } catch (error) {
        console.error('Error fetching projects', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, category]);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Find Work</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Browse open freelance projects.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Writing & Translation">Writing & Translation</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 md:py-20">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-xl text-center border border-slate-100 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No projects available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} role="freelancer" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
