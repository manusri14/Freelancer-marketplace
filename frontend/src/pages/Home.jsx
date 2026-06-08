import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-6">Find the Perfect Freelancer for Your Business</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-indigo-100">
            Connect with top talent around the world. Secure payments, excellent quality, and faster delivery.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register?role=client" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-50 transition">
              Hire Talent
            </Link>
            <Link to="/register?role=freelancer" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-600 transition">
              Find Work
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-white">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Web Development', 'Graphic Design', 'Digital Marketing', 'Writing & Translation'].map((category, index) => (
              <Link 
                to={`/projects?category=${encodeURIComponent(category)}`} 
                key={index} 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-shadow p-6 text-center cursor-pointer border border-slate-100 dark:border-slate-700 block"
              >
                <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-slate-200">{category}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Explore category &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
