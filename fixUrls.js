const fs = require('fs');
const glob = require('glob'); // Wait, glob might not be installed.

const files = [
  'frontend/src/pages/ViewProposal.jsx',
  'frontend/src/pages/Settings.jsx',
  'frontend/src/pages/Projects.jsx',
  'frontend/src/pages/ProjectDetails.jsx',
  'frontend/src/pages/ManageProject.jsx',
  'frontend/src/pages/Freelancers.jsx',
  'frontend/src/pages/FreelancerProfile.jsx',
  'frontend/src/pages/FreelancerDashboard.jsx',
  'frontend/src/pages/CreateProject.jsx',
  'frontend/src/pages/ClientDashboard.jsx',
  'frontend/src/pages/Chat.jsx',
  'frontend/src/pages/AdminDashboard.jsx',
  'frontend/src/context/AuthContext.jsx'
];

files.forEach(f => {
  const p = require('path').join(__dirname, f);
  if(fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    // Simple string replace for ALL occurrences of `/api/
    let newContent = content.split('`/api/').join('`${import.meta.env.VITE_API_URL}/api/');
    if(content !== newContent) {
      fs.writeFileSync(p, newContent);
      console.log('Fixed', p);
    }
  }
});
