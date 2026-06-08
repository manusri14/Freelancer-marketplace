import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import ManageProject from './pages/ManageProject';
import Freelancers from './pages/Freelancers';
import FreelancerProfile from './pages/FreelancerProfile';
import CreateProject from './pages/CreateProject';
import ViewProposal from './pages/ViewProposal';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/projects/:id/manage" element={<ManageProject />} />
              <Route path="/proposals/:id" element={<ViewProposal />} />
              <Route path="/freelancers" element={<Freelancers />} />
              <Route path="/freelancers/:id" element={<FreelancerProfile />} />
              <Route path="/projects/create" element={<CreateProject />} />
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/chat/:userId" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <footer className="bg-slate-900 py-6 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Freelancer Marketplace. All rights reserved.</p>
          </footer>
          <BottomNav />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
