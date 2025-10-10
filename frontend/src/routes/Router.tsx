import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home.tsx';
import Information from '../pages/Information.tsx';
import Home2 from '../pages/Home2.tsx';
import MappableV3 from '../pages/MappableV3.tsx';
import { Plane } from 'lucide-react';

function RouterView() {
    return (
        <Router>
            <div className="min-h-screen bg-neutral-500">
                <nav className="bg-neutral-800 shadow-sm py-3">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16">
                            <div className="flex items-center justify-between w-full space-x-8">
                                <Link to="/" className="text-2xl font-bold text-white text-decoration-none">
                                    <Plane className="inline-block" /> SMUxChange
                                </Link>
                                <div className="flex space-x-4">
                                    <Link to="/" className="text-2xl font-bold text-white text-decoration-none">
                                        Home
                                    </Link>
                                    <Link to="/mappablev3" className="text-2xl font-bold text-white text-decoration-none">
                                        MappableV3
                                    </Link>
                                    <Link to="/information" className="text-2xl font-bold text-white text-decoration-none">
                                        Information
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
                        <Route path="/home2" element={<Home2 />} />
                        <Route path="/mappablev3" element={<MappableV3 />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default RouterView;