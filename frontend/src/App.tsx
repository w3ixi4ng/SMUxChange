import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Mappable from './pages/Mappable.tsx';
import Information from './pages/Information.tsx';
import MappableV2 from './pages/MappableV2.tsx';
import Home2 from './pages/Home2.tsx';
import MappableV3 from './pages/MappableV3.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16">
              <div className="flex items-center justify-between w-full space-x-8">
                <Link to="/" className="text-xl font-bold text-gray-900 ">
                  SMUxChange
                </Link>
                <div className="flex space-x-4">
                  <Link 
                    to="/" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/information" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Information
                  </Link>
                  <Link 
                    to="/mappable" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Mappable
                  </Link>
                  <Link 
                    to="/mappablev2" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Mappable V2
                  </Link>
                  <Link 
                    to="/mappablev3" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Mappable V3
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/information" element={<Information />} />
            <Route path="/mappable" element={<Mappable />} />
            <Route path="/mappablev2" element={<MappableV2 />} />
            <Route path="/home2" element={<Home2 />} /> 
            <Route path="/mappablev3" element={<MappableV3 />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
