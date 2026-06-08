import { Link } from 'react-router-dom';

const ProjectCard = ({ project, role }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700 p-6 mb-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            <Link to={`/projects/${project._id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
              {project.title}
            </Link>
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Posted {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
          {project.status.toUpperCase()}
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.requiredSkills.map((skill, index) => (
          <span key={index} className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs px-2 py-1 rounded">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="font-bold text-slate-800 dark:text-white">
          ${project.budget}
        </div>
        {role === 'freelancer' && (
          <Link to={`/projects/${project._id}`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium text-sm">
            View Details
          </Link>
        )}
        {role === 'client' && (
          <Link to={`/projects/${project._id}/manage`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium text-sm">
            Manage Project
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
