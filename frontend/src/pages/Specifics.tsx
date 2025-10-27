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
    switzerland : "ch", 
    argentina : "ar",
    austria : "at",
    belgium : "be"
  };
  const key = (countryName || "").toLowerCase().trim();
  return map[key] || "xx";
}
function scrollToTop() {
    const topElement = document.getElementById("top");
    if (topElement) {
      topElement.scrollIntoView({ behavior: "auto" }); // instant scroll
    }
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
  const [data, setData] = useState(() => {
        const schoolData = sessionStorage.getItem("school");
        console.log(schoolData)
        if (schoolData){
            var parse_data = JSON.parse(schoolData);
            return {
                ...parse_data,
                rating: 4.5,
                review:0
            }
        }
        return null
    });
    const [maxPrice, setMaxPrice] = useState(2000);
    const [accommodations, setAccommodations] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [showAllBaskets, setShowAllBaskets] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false); 
    const [distanceCalculated, setDistanceCalculated] = useState(false);


  // Effect to add/remove scroll event listener
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    async function get_events() {
        try {
            const response_data = await axios.get(`http://localhost:3001/api/events/${data.city}/${data.country}`);
            console.log(response_data.data.events_results)
            setEvents(response_data.data.events_results);
        } catch(err) {
            console.log(err)
        }
    }

    async function get_accomodations() {
        try {
            const response_data = await axios.get(`http://localhost:3001/api/apartments/${data.host_university}`)
            setAccommodations(response_data.data);
        } catch(err) {
            console.log(err);
        }
    };
    

    function round_up_time(seconds:number){
        console.log(seconds)
        const hours = Math.floor(seconds/3600);
        const minutes = Math.floor((seconds%3600)/60);
        const secs = Math.floor(seconds%60);
        console.log(hours,minutes, secs)

        if (hours>0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`
        }
    }

    async function helper_distance(origin: string, destination:string) {
        const mode_values: string[] = ["DRIVE", "WALK", "TRANSIT"];
        var return_values: any = {};
        for (var i = 0; i< mode_values.length; i++) {
                try {
                    const response = await axios.get(`http://localhost:3001/api/distance/${origin}/${destination}/${mode_values[i]}`);
                    if (i ==0 ) {
                        return_values["distance"]= response.data.routes[0].distanceMeters
                            
                    };
                    var time_taken = round_up_time(response.data.routes[0].duration.split("s")[0]);
                    return_values[mode_values[i]] = time_taken
                }
                catch(err) {
                    console.log(err);
                }
        
        }
        return return_values
    }

    async function get_distance() {
        const updatedAccomodations = [];
        const updatedEvents = [];
        for (let i=0; i< accommodations.length; i++) {
            const distanceData = await helper_distance(
                data["host_university"],
                accommodations[i]["formatted_address"]
            );

            updatedAccomodations.push( {
                ...accommodations[i],
                ...distanceData
            })
        }
        for (let j=0; j< events.length; j++) {
            const distance_event_data = await helper_distance(
                data["host_university"],
                events[j]["address"][0]
            );
            updatedEvents.push( {
                ...events[j],
                ...distance_event_data
            })
        }
        setAccommodations(updatedAccomodations);
        setEvents(updatedEvents);
    }

    useEffect(() => {
        get_events(),
        get_accomodations()
    }, []);

    useEffect(() => {
        async function calculateDistanceOnce() {
        if (accommodations.length > 0 && !distanceCalculated) {
            await get_distance();
            setDistanceCalculated(true);
        }
        }
        calculateDistanceOnce();
    },[accommodations, distanceCalculated])

    console.log(data,accommodations)
    console.log(events)

  // Fallback fetch if refresh
  
  if (!data)
    return <div className="text-center text-white mt-20">Loading...</div>;

  return (
    <div className="min-h-screen text-white bg-[#0b0b0b] bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.05)_0%,transparent_25%),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.03)_0%,transparent_30%)]">
      <div className="container mx-auto px-6 py-12 space-y-10">
        <div id="top" />
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {data && data.host_university}
            </h1>
            <div className="flex items-center gap-3">
              <img
                src={`https://flagcdn.com/${getCountryCode(data.country)}.svg`}
                alt={data && data.country}
                className="w-8 h-5 rounded-md"
              />
              <span className="text-gray-300">{data && data.country}</span>
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
              {data && data.description}
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
                  {(data.rating).toFixed(1)} ({data.reviews} reviews)
                </span>
              </div>

              <p className="text-sm text-gray-400 mt-3 font-semibold">
                GPA Requirements
              </p>
              <div className="flex gap-4 text-sm font-semibold">
                <span className="text-green-400">
                  Max GPA: {data && data.max_gpa}
                </span>
                <span className="text-red-400">
                  Min GPA: {data && data.min_gpa}
                </span>
                <span className="text-blue-400">
                  Places: {data && data.places}
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
                //  .filter((a) => a.price <= maxPrice)
                //  .filter((a) => parseFloat(a.distance) <= (data.maxDistance ?? 2.0))
                  .map((a, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-xl w-72 shrink-0 hover:bg-white/10 transition-all duration-200"
                    >
                      <img
                        src={a.icon}
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
      {/* Scroll to top button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/70 text-white shadow-md hover:bg-black/90 transition-opacity"
          aria-label="Scroll to top"
          style={{ backdropFilter: "blur(5px)" }}
        >
          ↑
        </button>
      )}
      </div>
    </div>
  );
}
