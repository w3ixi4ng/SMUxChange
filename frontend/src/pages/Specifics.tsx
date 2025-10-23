import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

// HELPER FUNCTIONS
function filenameFromName(name: string) {
  return (name || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[,.'"`()/&:+\-]/g, "")
    .replace(/\s+/g, "_");
}

function getCountryCode(countryName?: string) {
  const map: Record<string, string> = {
    "united states": "us",
    "united states of america": "us",
    usa: "us",
    "united kingdom": "gb",
    uk: "gb",
    england: "gb",
    singapore: "sg",
    japan: "jp",
    france: "fr",
    germany: "de",
    australia: "au",
    canada: "ca",
    italy: "it",
    spain: "es",
    "korea, republic of": "kr",
    "south korea": "kr",
    china: "cn",
    "hong kong": "hk",
  };
  const key = (countryName || "").toLowerCase().trim();
  return map[key] || "xx";
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const partialFill = rating - fullStars;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < fullStars;
        const isPartial = i === fullStars && partialFill > 0;

        return (
          <div key={i} className="relative w-6 h-6">
            <Star
              size={24}
              stroke="#FFD700"
              fill="rgba(255,255,255,0.1)"
              className="absolute top-0 left-0"
            />
            {(isFull || isPartial) && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{
                  width: isFull ? "100%" : `${partialFill * 90}%`,
                }}
              >
                <Star
                  size={24}
                  fill="#FFD700"
                  stroke="#FFD700"
                  className="absolute top-0 left-0"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// MAIN COMPONENT
export default function Specifics() {
  const { universityName } = useParams();
  const location = useLocation();
  const schoolFromState = location.state?.school;

  const [data, setData] = useState<any>(schoolFromState || null);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [showAllBaskets, setShowAllBaskets] = useState(false);

  // Fallback fetch if refresh
  useEffect(() => {
    if (!data && universityName) {
      fetch(`/api/schools?name=${decodeURIComponent(universityName)}`)
        .then((res) => res.json())
        .then((schoolData) => setData(schoolData))
        .catch(() => {
          setData({
            name: decodeURIComponent(universityName),
            country: "Switzerland",
            rating: 4.5,
            reviews: 0,
            min_gpa: 3.46,
            max_gpa: 3.93,
            places: 32,
            description:
              "The University of St Gallen is renowned for its strong focus on business and economics, making it an ideal choice for exchange students interested in these fields. Its international environment and diverse student body enhance the learning experience, fostering global networking opportunities.",
            mappable_basket: [
              "Accounting Data and Analytics Major Elective",
              "Accounting Major Elective",
              "Asian Studies",
              "Communications Management Major Elective",
              "Cultures of the Modern World",
              "Data Science and Analytics Major Elective",
              "Digital Business Electives – A",
              "Economics Major Elective",
              "Finance (Finance Analytics) Track Elective",
              "Finance (Real Estate) Track Elective",
              "Finance Major Elective",
              "Financial Forensics Major Elective",
              "Information Systems Depth Elective",
              "Innovation & Entrepreneurship Major Elective",
              "Marketing Major Elective",
              "Sustainability Elective (B)",
            ],
          });
        });
    }
  }, [data, universityName]);

  // Mock demo data
  useEffect(() => {
    setAccommodations([
      { name: "Campus Village", price: 950, distance: "1.2 km" },
      { name: "Z Place Apartments", price: 1100, distance: "0.6 km" },
      { name: "Ann Arbor Housing Co.", price: 1250, distance: "0.9 km" },
      { name: "Student Hub Residence", price: 1400, distance: "1.8 km" },
    ]);

    setEvents([
      { title: "Art Fair", desc: "Downtown Ann Arbor street festival" },
      { title: "Game Day", desc: "Football Match at Michigan Stadium" },
      { title: "Tech Meetup", desc: "Local networking and innovation event" },
      { title: "Music Night", desc: "Live concert at central square" },
    ]);
  }, []);

  if (!data)
    return <div className="text-center text-white mt-20">Loading...</div>;

  return (
    <div className="min-h-screen text-white bg-[#0b0b0b] bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.05)_0%,transparent_25%),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.03)_0%,transparent_30%)]">
      <div className="container mx-auto px-6 py-12 space-y-10">

        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {data.name || data.host_university}
            </h1>
            <div className="flex items-center gap-3">
              <img
                src={`https://flagcdn.com/${getCountryCode(data.country)}.svg`}
                alt={data.country}
                className="w-8 h-5 rounded-md"
              />
              <span className="text-gray-300">{data.country}</span>
            </div>
          </div>

          {data.website && (
            <Button asChild variant="secondary" className="mt-4 md:mt-0">
              <a href={data.website} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </Button>
          )}
        </div>

        {/* === HERO IMAGE === */}
        <div className="relative w-full h-80 overflow-hidden rounded-2xl shadow-lg">
          {(() => {
            const derived = `/images/${filenameFromName(
              data.name || data.host_university || ""
            )}.jpg`;
            const src = data.images?.[0] || derived;
            return (
              <img
                src={src}
                alt={data.name || data.host_university}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/images/default_university.jpg";
                }}
              />
            );
          })()}
        </div>

        {/* === DETAILS CARD === */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-300 font-semibold">
              About the University
            </CardTitle>
            <CardDescription className="text-white/90 leading-relaxed">
              {data.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6 mt-4">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p>{data.contact || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p>{data.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Rating</p>
              <div className="flex items-center gap-2">
                <StarRating rating={data.rating || 4.5} />
                <span className="text-sm text-gray-300">
                  {(data.rating || 4.5).toFixed(1)} ({data.reviews || 0} reviews)
                </span>
              </div>

              <p className="text-sm text-gray-400 mt-3 font-semibold">
                GPA Requirements
              </p>
              <div className="flex gap-4 text-sm font-semibold">
                <span className="text-green-400">
                  Max GPA: {data.max_gpa ?? "N/A"}
                </span>
                <span className="text-red-400">
                  Min GPA: {data.min_gpa ?? "N/A"}
                </span>
                <span className="text-blue-400">
                  Places: {data.places ?? "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* === WEBSITE LINK SECTION === */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-lg text-white font-semibold">
              Website Link
            </CardTitle>
            <CardDescription className="text-gray-300">
              <a
                href="https://placeholder-university-website.com"
                className="text-blue-400 hover:underline"
                target="_blank"
              >
                https://placeholder-university-website.com
              </a>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* === ELECTIVES === */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-10">
          <CardHeader>
            <CardTitle className="text-lg text-white font-semibold">
              Your Maps
            </CardTitle>
            <CardDescription className="text-gray-400">
              Explore all electives available for this university.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-500 overflow-hidden ${
                  showAllBaskets
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-[260px] opacity-95" // collapsed to show only ~2 rows
                }`}
              >
                {data.mappable_basket?.map((basket: string, i: number) => (
                  <div key={i} className="flex justify-center">
                    <span className="bg-[#1e1f23] text-white/90 px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[#2a2b30] hover:text-white transition-all duration-200 text-center w-full max-w-[280px]">
                      {basket}
                    </span>
                  </div>
                ))}
              </div>

              {data.mappable_basket?.length > 6 && (
                <button
                  onClick={() => setShowAllBaskets((prev) => !prev)}
                  className="flex items-center gap-2 px-5 py-2 mt-5 rounded-full bg-white/10 text-gray-200 text-sm font-semibold hover:bg-white/20 transition-all"
                >
                  {showAllBaskets ? (
                    <>
                      Show less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* === PLAN YOUR STAY & EXPLORE NEARBY === */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-10">
          <CardHeader>
            <CardTitle className="text-lg text-white font-semibold">
              Plan Your Stay & Explore Nearby
            </CardTitle>
            <CardDescription className="text-gray-400">
              Discover nearby accommodations and events — all connected on the same interactive map.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Map Placeholder */}
            <div className="relative w-full h-96 rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <img
                src="/images/map_placeholder_api.jpg"
                alt="Interactive Map Placeholder"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/40 to-transparent flex items-end justify-center p-4">
                <p className="text-sm text-gray-300 italic">
                  🗺️ Map placeholder — backend to replace with Map API (Google Maps / Mapbox)
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block mb-2 text-gray-400 text-sm">
                  Filter by max price (${maxPrice})
                </label>
                <Input
                  type="range"
                  min={500}
                  max={2000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-400 text-sm">
                  Filter by max distance ({data.maxDistance ?? "2.0"} km)
                </label>
                <Input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={data.maxDistance ?? 2.0}
                  onChange={(e) =>
                    setData((prev: any) => ({
                      ...prev,
                      maxDistance: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-blue-400"
                />
              </div>
            </div>

            {/* Accommodations */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Nearby Accommodations
              </h3>
              <div className="flex overflow-x-auto gap-6 pb-3">
                {accommodations
                  .filter((a) => a.price <= maxPrice)
                  .filter((a) => parseFloat(a.distance) <= (data.maxDistance ?? 2.0))
                  .map((a, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-xl w-72 shrink-0 hover:bg-white/10 transition-all duration-200"
                    >
                      <img
                        src={`/images/accommodation_${i + 1}.jpg`}
                        onError={(e) =>
                          ((e.currentTarget as HTMLImageElement).src =
                            "/images/accommodations_placeholder.jpg")
                        }
                        alt={a.name}
                        className="w-full h-40 object-cover rounded-t-xl"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-1">{a.name}</h4>
                        <p className="text-gray-300 text-sm mb-3">
                          ${a.price}/month • {a.distance} from campus
                        </p>
                        <Button
                          asChild
                          className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white no-underline"
                        >
                          <a href="#" title="View on shared map" data-map-marker={a.name}>
                            📍 View on Map
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Events */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Nearby Events & Activities
              </h3>
              <div className="flex overflow-x-auto gap-6 pb-3">
                {events.map((ev, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-xl w-72 shrink-0 hover:bg-white/10 transition-all duration-200"
                  >
                    <img
                      src={`/images/event_${i + 1}.jpg`}
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).src =
                          "/images/event_placeholder.jpg")
                      }
                      alt={ev.title}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-1">{ev.title}</h4>
                      <p className="text-gray-300 text-sm mb-3">{ev.desc}</p>
                      <Button
                        asChild
                        className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white no-underline"
                      >
                        <a href="#" title="View on shared map" data-map-marker={ev.title}>
                          🎯 View on Map
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}