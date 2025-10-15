import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type School = {
  id: number;
  name: string;
  country: string;
  city: string;
  gpaRequired: number;
  description: string;
  courses: string[];
  attractions: string[];
};

// Hardcoded School dataset
const schoolsData: School[] = [
  {
    id: 1,
    name: 'University of Oxford',
    country: 'United Kingdom',
    city: 'Oxford',
    gpaRequired: 3.7,
    description:
      "One of the world's oldest and most prestigious universities, Oxford offers exceptional academic programs in a historic setting. Known for its tutorial system and rigorous academics.",
    courses: ['Computer Science', 'Business', 'Literature', 'History', 'Mathematics', 'Engineering'],
    attractions: ['Bodleian Library', 'Christ Church College', 'Oxford Castle', 'Ashmolean Museum', 'Oxford Botanic Garden'],
  },
  {
    id: 2,
    name: 'University of Cambridge',
    country: 'United Kingdom',
    city: 'Cambridge',
    gpaRequired: 3.8,
    description:
      'Historic collegiate university renowned for research-led teaching and supervision-based learning across sciences and humanities.',
    courses: ['Computer Science', 'Natural Sciences', 'Engineering', 'Economics', 'Law', 'Linguistics'],
    attractions: ['King’s College Chapel', 'The Backs', 'Fitzwilliam Museum', 'Mathematical Bridge', 'Cam River Punting'],
  },
  {
    id: 3,
    name: 'Harvard University',
    country: 'United States',
    city: 'Cambridge',
    gpaRequired: 3.8,
    description:
      'An Ivy League university renowned for research excellence, leadership development, and a global network of alumni.',
    courses: ['Computer Science', 'Business', 'Law', 'Medicine', 'Political Science', 'Philosophy'],
    attractions: ['Harvard Yard', 'Harvard Art Museums', 'Cambridge Common', 'Charles River', 'Harvard Square'],
  },
  {
    id: 4,
    name: 'Stanford University',
    country: 'United States',
    city: 'Stanford',
    gpaRequired: 3.8,
    description:
      'Private research university with strong ties to Silicon Valley, entrepreneurship, and interdisciplinary innovation.',
    courses: ['Computer Science', 'Management Science & Engineering', 'Human-Centered Design', 'Biology', 'Data Science', 'Aerospace'],
    attractions: ['Hoover Tower', 'Cantor Arts Center', 'Stanford Dish', 'Palm Drive', 'Rodin Sculpture Garden'],
  },
  {
    id: 5,
    name: 'National University of Singapore',
    country: 'Singapore',
    city: 'Singapore',
    gpaRequired: 3.6,
    description:
      'Singapore’s top university offering innovative research programs and strong industry partnerships across Asia.',
    courses: ['Computer Science', 'Business', 'Engineering', 'Pharmacy', 'Architecture', 'Public Health'],
    attractions: ['Singapore Botanic Gardens', 'Marina Bay Sands', 'Sentosa Island', 'Gardens by the Bay', 'Chinatown'],
  },
  {
    id: 6,
    name: 'Nanyang Technological University',
    country: 'Singapore',
    city: 'Singapore',
    gpaRequired: 3.6,
    description:
      'Young research-intensive university known for engineering, sustainability, and AI/robotics.',
    courses: ['Computer Science', 'Electrical & Electronic Engineering', 'Materials Science', 'Business', 'Communication Studies', 'Education'],
    attractions: ['Jurong Lake Gardens', 'Chinese Garden', 'Science Centre Singapore', 'Haw Par Villa', 'NTU Chinese Heritage Centre'],
  },
  {
    id: 7,
    name: 'University of Tokyo',
    country: 'Japan',
    city: 'Tokyo',
    gpaRequired: 3.7,
    description:
      "Japan's leading institution for higher learning, known for scientific research, cultural contributions, and global exchange programs.",
    courses: ['Computer Science', 'Economics', 'Literature', 'Physics', 'Law', 'Medicine'],
    attractions: ['Tokyo Tower', 'Ueno Park', 'Tokyo National Museum', 'Shinjuku Gyoen', 'Meiji Shrine'],
  },
  {
    id: 8,
    name: 'Kyoto University',
    country: 'Japan',
    city: 'Kyoto',
    gpaRequired: 3.7,
    description:
      'Prominent national university emphasizing fundamental research and academic freedom.',
    courses: ['Informatics', 'Chemical Engineering', 'Agriculture', 'Philosophy', 'Mathematics', 'Earth Sciences'],
    attractions: ['Fushimi Inari Shrine', 'Kiyomizu-dera', 'Arashiyama Bamboo Grove', 'Nijo Castle', 'Philosopher’s Path'],
  },
  {
    id: 9,
    name: 'University of Melbourne',
    country: 'Australia',
    city: 'Melbourne',
    gpaRequired: 3.6,
    description:
      'A leading Australian university emphasizing research innovation, cultural diversity, and entrepreneurial skills.',
    courses: ['Computer Science', 'Business', 'Fine Arts', 'Biology', 'Education', 'Environmental Science'],
    attractions: ['Royal Botanic Gardens', 'Federation Square', 'National Gallery of Victoria', 'Queen Victoria Market', 'Yarra River'],
  },
  {
    id: 10,
    name: 'Australian National University',
    country: 'Australia',
    city: 'Canberra',
    gpaRequired: 3.6,
    description:
      'Research university noted for public policy, earth sciences, and Asia-Pacific studies.',
    courses: ['Computer Science', 'Public Policy', 'International Security', 'Astronomy', 'Linguistics', 'Statistics'],
    attractions: ['Australian War Memorial', 'Lake Burley Griffin', 'National Gallery of Australia', 'Mount Ainslie Lookout', 'Parliament House'],
  },
];

function Information() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);

  const countries = useMemo(() => {
    return Array.from(new Set(schoolsData.map((s) => s.country))).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const c = country.trim().toLowerCase();
    return schoolsData.filter((s) => {
      const matchesCountry = !c || s.country.toLowerCase().includes(c);
      const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
      return matchesCountry && matchesQuery;
    });
  }, [query, country]);

  useEffect(() => {
    if (selectedSchool && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedSchool]);

  // Plane scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const plane = document.getElementById('plane');
      if (!plane) return;
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      const maxY = window.innerHeight - 100;
      const offsetX = Math.sin(scrollPercent * 6) * 30; // gentle wave
      plane.style.transform = `translate(${offsetX}px, ${scrollPercent * maxY}px)`; // no rotation
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Information</h1>

      {/* Filters */}
      <div ref={filtersRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search school or city</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Oxford or Almaty"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Details Section */}
      {selectedSchool ? (
        <div ref={cardRef} className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedSchool.name}</h2>
              <div className="text-gray-700 font-medium">Country: {selectedSchool.country}</div>
              <div className="text-gray-700 font-medium">City: {selectedSchool.city}</div>
              <div className="text-gray-700 font-medium">GPA Required: {selectedSchool.gpaRequired}+</div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSchool(null);
                filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Back to results
            </Button>
          </div>

          <div className="mb-4">
            <p className="text-gray-800">{selectedSchool.description}</p>
          </div>

          <div className="mb-4">
            <div className="font-semibold mb-2">Courses</div>
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              {selectedSchool.courses.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <div className="font-semibold mb-2">Attractions</div>
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              {selectedSchool.attractions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/mappable" className="w-full sm:w-auto">
              <Button className="w-full">Map to course</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm text-gray-600">
            Showing {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filtered.map((s) => (
              <button
                key={`${s.name}-${s.city}`}
                onClick={() => setSelectedSchool(s)}
                className="text-left p-4 rounded-lg border bg-white hover:shadow transition focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
              >
                <div className="font-semibold text-gray-900">{s.name}</div>
                <div className="mt-1 text-sm text-gray-600">
                  {s.city}, {s.country} • GPA: {s.gpaRequired}+
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Scrolling plane icon */}
      <div
        id="plane-scroll"
        style={{
          position: 'fixed',
          right: '110px',
          top: '64px', // start BELOW navbar (adjust if your navbar is taller)
          height: 'calc(100vh - 64px)', // keep the plane within the visible area below navbar
          pointerEvents: 'none',
          zIndex: 20, // keep below navbar if navbar z-index is higher (e.g. 50)
        }}
      >
        <svg
          id="plane"
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="white"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            transition: 'transform 0.2s ease-out',
            color: '#1d4ed8', // Tailwind blue-700 tone
            transform: 'rotate(-10deg)', // stays upright but tilted forward slightly
          }}
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      </div>
    </div>
  );
}


export default Information;



