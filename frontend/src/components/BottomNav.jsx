import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Briefcase, Users, User, Settings, LogIn } from 'lucide-react';

const BottomNav = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getNavItems = () => {
    // Unauthenticated user
    if (!user) {
      return [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Find Work', path: '/projects', icon: Briefcase },
        { name: 'Talent', path: '/freelancers', icon: Users },
        { name: 'Login', path: '/login', icon: LogIn },
      ];
    }
    
    // Admin user
    if (user.role === 'admin') {
      return [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Dashboard', path: '/admin/dashboard', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    }

    // Client user
    if (user.role === 'client') {
      return [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Talent', path: '/freelancers', icon: Users },
        { name: 'Dashboard', path: '/client/dashboard', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    }

    // Freelancer user
    if (user.role === 'freelancer') {
      return [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Find Work', path: '/projects', icon: Briefcase },
        { name: 'Dashboard', path: '/freelancer/dashboard', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    }
    
    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || 
                           (item.path !== '/' && location.pathname.startsWith(item.path));
          
          const Icon = item.icon;
          
          return (
            <Link 
              key={index} 
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 active:scale-95 ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
