import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const CreateProject = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    category: '',
    requiredSkills: '',
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateAI = async () => {
    if (!formData.title || !formData.category || !formData.requiredSkills) {
      setError('Please fill in Title, Category, and Required Skills to generate a description.');
      return;
    }
    
    setAiLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/generate-description`, {
        title: formData.title,
        category: formData.category,
        keywords: formData.requiredSkills
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({ ...formData, description: data.text });
    } catch (err) {
      setError('Failed to generate AI description. Ensure Gemini API key is configured.');
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim())
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/projects`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/client/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'client') {
    return <div className="text-center py-10 md:py-20">Access Denied. Only clients can post projects.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Post a Project</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Fill out the details below to find the perfect freelancer.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="e.g. Build a React Ecommerce Store"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Design">Design</option>
                <option value="Writing">Writing</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Budget ($)</label>
              <input 
                type="number" 
                name="budget" 
                value={formData.budget} 
                onChange={handleChange} 
                required 
                min="5"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Required Skills (comma separated)</label>
              <input 
                type="text" 
                name="requiredSkills" 
                value={formData.requiredSkills} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Deadline</label>
              <input 
                type="date" 
                name="deadline" 
                value={formData.deadline} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Project Description</label>
              <button 
                type="button" 
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="text-sm flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium"
              >
                <Sparkles size={16} className="mr-1" />
                {aiLoading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows="6"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="Describe your project requirements in detail..."
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
