import { Link } from 'react-router-dom';
import { Code, PenTool, TrendingUp, Globe, ShieldCheck, Zap, Star, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-12 md:pt-24 pb-16 md:pb-32">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
          <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
            <span className="text-sm font-medium text-slate-200">Over 10,000 top freelancers are online</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-white leading-tight">
            Build your dreams with <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              world-class talent.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-6 md:mb-12 max-w-3xl mx-auto text-slate-300 font-light leading-relaxed">
            Connect with vetted professionals from around the globe. Enjoy secure payments, extraordinary quality, and faster delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register?role=client" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:-translate-y-1 transition-all duration-300 text-lg">
              Hire Talent Now
            </Link>
            <Link to="/register?role=freelancer" className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-10 rounded-full hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 text-lg">
              Find Work
            </Link>
          </div>
        </div>
        
        {/* Subtle Bottom Curve/Fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent"></div>
      </section>

      {/* Trust Banner */}
      <section className="py-10 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 shadow-sm relative z-20 -mt-10 mx-6 rounded-2xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-around items-center gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-slate-800 dark:text-white mb-1">4.9/5</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center"><Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" /> Average Rating</p>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-800 dark:text-white mb-1">50k+</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Projects Completed</p>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-800 dark:text-white mb-1">$5M+</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Paid Securely</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">Explore Popular Categories</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Find experts in the most in-demand fields right now.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Web Development', icon: Code, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { name: 'Graphic Design', icon: PenTool, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { name: 'Digital Marketing', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
              { name: 'Writing & Translation', icon: Globe, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' }
            ].map((category, index) => {
              const Icon = category.icon;
              return (
                <Link 
                  to={`/projects?category=${encodeURIComponent(category.name)}`} 
                  key={index} 
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 block relative overflow-hidden"
                >
                  <div className={`w-20 h-20 mx-auto ${category.bg} rounded-2xl mb-6 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className={`w-10 h-10 ${category.color}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{category.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium inline-flex items-center">
                    Explore experts <Globe className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 md:py-24 bg-indigo-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">How FreelanceHub Works</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Getting things done has never been easier or more secure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] w-[70%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 dark:from-slate-700 dark:via-indigo-900 dark:to-slate-700 -z-10"></div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-900 rounded-full shadow-lg border-4 border-indigo-100 dark:border-slate-800 flex items-center justify-center mb-6 relative z-10 text-indigo-600 dark:text-indigo-400">
                <Globe size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">1. Post a Project</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Tell us what you need done. AI will help you craft the perfect description in seconds.</p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-900 rounded-full shadow-lg border-4 border-purple-100 dark:border-slate-800 flex items-center justify-center mb-6 relative z-10 text-purple-600 dark:text-purple-400">
                <Users size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">2. Choose Talent</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Receive bids within minutes. Review profiles, portfolios, and chat securely.</p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-900 rounded-full shadow-lg border-4 border-green-100 dark:border-slate-800 flex items-center justify-center mb-6 relative z-10 text-green-600 dark:text-green-400">
                <ShieldCheck size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">3. Pay Securely</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Your money is held in escrow until you are 100% satisfied with the delivered work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-indigo-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-50 z-0 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <Zap size={48} className="mx-auto text-yellow-400 mb-6 animate-bounce" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to get started?</h2>
          <Link to="/register" className="inline-block bg-white text-indigo-900 font-bold text-lg py-4 px-12 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300">
            Join For Free
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
