import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Upload, Save, User as UserIcon } from 'lucide-react';

const Settings = () => {
  const { user, updateUserContext } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setSkills(user.skills ? user.skills.join(', ') : '');
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let updatedUser = user;

      // 1. Upload Avatar if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        
        const avatarRes = await axios.post(`/api/users/avatar`, formData, {
          headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
        });
        updatedUser = avatarRes.data.data;
      }

      // 2. Update Profile Details
      const profileData = {
        name,
        bio,
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== '')
      };

      const profileRes = await axios.put(`/api/users/profile`, profileData, config);
      updatedUser = profileRes.data.data;

      // 3. Update Auth Context
      updateUserContext(updatedUser);
      setMessage('Profile updated successfully!');
      setSelectedFile(null); // Clear selected file after upload

    } catch (error) {
      console.error('Failed to update profile', error);
      setMessage(error.response?.data?.message || 'An error occurred while updating the profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center py-20">Please log in to view settings.</div>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Profile Settings</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Update your personal information and avatar.</p>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
        
        {/* Avatar Section */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900/30" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-4 border-slate-200 dark:border-slate-600">
                <UserIcon size={48} className="text-slate-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Profile Picture</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-sm">
              We recommend an image of at least 250x250px. You can upload a JPG, GIF or PNG file.
            </p>
            <label className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 px-4 py-2 rounded-lg cursor-pointer transition font-medium inline-flex items-center">
              <Upload size={18} className="mr-2" /> 
              {selectedFile ? 'Image Selected' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-700 my-8" />

        {/* Profile Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              placeholder="Tell us a little bit about yourself..."
            ></textarea>
          </div>

          {user.role === 'freelancer' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
              <input 
                type="text" 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                placeholder="e.g. React, Node.js, Graphic Design"
              />
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition font-medium inline-flex items-center disabled:opacity-50"
          >
            {loading ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Changes</>}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Settings;
