import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home.tsx';
import Information from '../pages/Information.tsx';
import Home2 from '../pages/Home2.tsx';
import MappableV3 from '../pages/MappableV3.tsx';
import Information2 from '../pages/Information2.tsx';
import { Plane, House, MapIcon, GraduationCap } from 'lucide-react';

function RouterView() {
    return (
        <Router>
            <div className="min-h-screen bg-neutral-500">
                <nav className="bg-neutral-800 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Roboto' }}>
                        <div className="flex h-16">
                            <div className="flex items-center justify-between w-full space-x-8">
                                <Link to="/" className="text-2xl font-bold text-white text-decoration-none">
                                    <Plane className="inline-block" /> SMUxChange
                                </Link>
                                <div className="flex space-x-4">
                                    <Link to="/" className="text-xl font-bold text-white text-decoration-none">
                                    <House className="inline-block" /> Home
                                    </Link>
                                    <Link to="/mappablev3" className="text-xl font-bold text-white text-decoration-none">
                                        <MapIcon className="inline-block" /> Map
                                    </Link>
                                    <Link to="/information" className="text-xl font-bold text-white text-decoration-none">
                                        <GraduationCap className="inline-block" /> Schools
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
                        <Route path="/information2" element={<Information2 />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default RouterView;