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
import axios from "axios";

/* ===========================
   HELPERS (unchanged)
   =========================== */
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
    switzerland: "ch",
    argentina: "ar",
    austria: "at",
    belgium: "be",
    brazil: "br",
    chile: "cl",
    croatia: "hr",
    "czech republic": "cz",
    denmark: "dk",
    ecuador: "ec",
    finland: "fi",
    hungary: "hu",
    iceland: "is",
    india: "in",
    indonesia: "id",
    ireland: "ie",
    israel: "il",
    kazakhstan: "kz",
    lithuania: "lt",
    mexico: "mx",
    morocco: "ma",
    netherlands: "nl",
    "new zealand": "nz",
    norway: "no",
    peru: "pe",
    philippines: "ph",
    portugal: "pt",
    qatar: "qa",
    russia: "ru",
    "russian federation": "ru",
    "south africa": "za",
    sweden: "se",
    taiwan: "tw",
    thailand: "th",
    turkey: "tr",
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

/* ===========================
   Star Rating (unchanged)
   =========================== */
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

/* ===========================
   Time-ago helper (unchanged)
   =========================== */
function timeAgo(ts?: number) {
  if (!ts) return "";
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

/* ===========================
   MAIN COMPONENT
   =========================== */
export default function Specifics() {
  /* ========== School data (unchanged) ========== */
  const [data, setData] = useState(() => {
    const schoolData = sessionStorage.getItem("school");
    console.log(schoolData);
    if (schoolData) {
      const parse_data = JSON.parse(schoolData);
      return {
        ...parse_data,
        rating: 4.5,
        review: 0,
      };
    }
    return null;
  });

  const [maxPrice, setMaxPrice] = useState(2000);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [showAllBaskets, setShowAllBaskets] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [distanceCalculated, setDistanceCalculated] = useState(false);

  /* =========================================================
     LOGIN STATE (IMPORTANT): Use sessionStorage set by LoginForm
     - We read uid/email/name (set after successful login)
     - This is what controls whether the review form shows up
     ========================================================= */
  const [currentUser, setCurrentUser] = useState<null | { uid: string; email?: string | null; name?: string | null }>(null);

  useEffect(() => {
    // IMPORTANT: this is the ONLY source of truth for UI login state right now
    const uid = sessionStorage.getItem("uid");
    const email = sessionStorage.getItem("email");
    const name = sessionStorage.getItem("name");
    if (uid) {
      setCurrentUser({ uid, email, name });
    } else {
      setCurrentUser(null);
    }
  }, []);
  // NOTE: Logout.tsx already clears sessionStorage, which resets this on next mount.

  /* ========== Reviews state (unchanged interface) ========== */
  const [reviews, setReviews] = useState<any[]>([]);
  const [ratingInput, setRatingInput] = useState<string>("");
  const [commentInput, setCommentInput] = useState<string>("");

  /* ========== Scroll listener (unchanged) ========== */
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

  /* ========== Events & Accommodations (unchanged) ========== */
  async function get_events() {
    try {
      const response_data = await axios.get(
        `http://localhost:3001/api/events/${data.city}/${data.country}`
      );
      console.log(response_data.data.events_results);
      setEvents(response_data.data.events_results);
    } catch (err) {
      console.log(err);
    }
  }

  async function get_accomodations() {
    try {
      const response_data = await axios.get(
        `http://localhost:3001/api/apartments/${data.host_university}`
      );
      setAccommodations(response_data.data);
    } catch (err) {
      console.log(err);
    }
  }

  /* =========================================================
     FETCH REVIEWS (IMPORTANT): use port 3001 + path param
     Backend route shape:
       GET  /database/getReviews/:university
       POST /database/saveReview
     ========================================================= */
  async function fetchReviews() {
    try {
      if (!data?.host_university) return;
      const url = `http://localhost:3001/database/getReviews/${encodeURIComponent(
        data.host_university
      )}`;
      const res = await axios.get(url);
      const arr = Array.isArray(res.data) ? res.data : [];
      const normalized = arr.map((r: any) => ({
        ...r,
        rating: Number(r?.rating ?? 0),
        createdAt:
          typeof r?.createdAt === "number"
            ? r.createdAt
            : typeof r?.updated_at === "number"
            ? r.updated_at
            : undefined,
      }));
      setReviews(normalized);
    } catch (e) {
      console.log("Error fetching reviews:", e);
    }
  }

  /* =========================================================
     SUBMIT REVIEW (IMPORTANT):
     - Requires currentUser.uid present
     - Sends uid, name, university, rating, comment
     - We add createdAt on the client for sorting (okay for now)
     ========================================================= */
  async function submitReview() {
    try {
      if (!currentUser?.uid) {
        alert("Please log in to submit a review.");
        return;
      }
      if (!ratingInput) {
        alert("Please enter a rating (0–5).");
        return;
      }

      const payload = {
        uid: currentUser.uid,
        name: currentUser.name || "Anonymous",
        university: data?.host_university,
        rating: Number(ratingInput),
        comment: commentInput || "",
        createdAt: Date.now(), // client timestamp for UI sorting (backend also tracks updated_at)
      };

      await axios.post("http://localhost:3001/database/saveReview", payload);

      // reset inputs + refresh list
      setRatingInput("");
      setCommentInput("");
      await fetchReviews();
      alert("✅ Review submitted!");
    } catch (e) {
      console.log("Error submitting review:", e);
      alert("Failed to submit review.");
    }
  }

  /* ========== Misc helpers (unchanged) ========== */
  function round_up_time(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  async function helper_distance(origin: string, destination: string) {
    const mode_values: string[] = ["DRIVE", "WALK", "TRANSIT"];
    const return_values: any = {};
    for (let i = 0; i < mode_values.length; i++) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/distance/${origin}/${destination}/${mode_values[i]}`
        );
        if (i == 0) {
          return_values["distance"] =
            response.data.routes?.[0]?.distanceMeters / 1000;
        }
        const time_taken = round_up_time(
          response.data.routes?.[0]?.duration.split("s")[0]
        );
        return_values[mode_values[i]] = time_taken;
      } catch (err) {
        console.log(err);
      }
    }
    return return_values;
  }

  async function get_distance() {
    const updatedAccomodations: any[] = [];
    const updatedEvents: any[] = [];
    for (let i = 0; i < accommodations.length; i++) {
      const distanceData = await helper_distance(
        data["host_university"],
        accommodations[i]["formatted_address"]
      );

      updatedAccomodations.push({
        ...accommodations[i],
        ...distanceData,
      });
    }
    for (let j = 0; j < events.length; j++) {
      const distance_event_data = await helper_distance(
        data["host_university"],
        events[j]["address"][0]
      );
      updatedEvents.push({
        ...events[j],
        ...distance_event_data,
      });
    }
    setAccommodations(updatedAccomodations);
    setEvents(updatedEvents);
  }

  /* ========== Effects bootstrapping (unchanged) ========== */
  useEffect(() => {
    get_events();
    get_accomodations();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function calculateDistanceOnce() {
      if (accommodations.length > 0 && !distanceCalculated) {
        await get_distance();
        setDistanceCalculated(true);
      }
    }
    calculateDistanceOnce();
  }, [accommodations, distanceCalculated]);

  /* ========== Fetch reviews once school is known (unchanged trigger, fixed URL) ========== */
  useEffect(() => {
    if (data?.host_university) {
      fetchReviews();
    }
  }, [data?.host_university]);

  /* ========== Derived review stats (unchanged) ========== */
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length
    : null;

  const sortedReviews = [...reviews].sort((a, b) => {
    const ta = typeof a.createdAt === "number" ? a.createdAt : 0;
    const tb = typeof b.createdAt === "number" ? b.createdAt : 0;
    return tb - ta;
  });

  /* ===========================
     RENDER
     =========================== */
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
                src={`https://flagcdn.com/${getCountryCode(data?.country)}.svg`}
                alt={data && data.country}
                className="w-8 h-5 rounded-md"
              />
              <span className="text-gray-300">{data && data.country}</span>
            </div>
          </div>

          {data?.website && (
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
            const derived = `/images/university_pictures/${data?.host_university}.jpg`;
            const src = data?.images?.[0] || derived;
            return (
              <img
                src={src}
                alt={data?.name || data?.host_university}
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
              <p>{data?.contact || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p>{data?.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Rating</p>
              <div className="flex items-center gap-2">
                <StarRating rating={(data && data.rating) || 0} />
                <span className="text-sm text-gray-300">
                  {(data?.rating || 0).toFixed(1)} ({data?.reviews} reviews)
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
                    : "max-h-[260px] opacity-95"
                }`}
              >
                {data &&
                  data.mappable_basket?.map((basket: string, i: number) => (
                    <div key={i} className="flex justify-center">
                      <span className="bg-[#1e1f23] text-white/90 px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[#2a2b30] hover:text-white transition-all duration-200 text-center w-full max-w-[280px]">
                        {basket}
                      </span>
                    </div>
                  ))}
              </div>

              {data && data.mappable_basket?.length > 6 && (
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

        {/* === STUDENT REVIEWS (includes IMPORTANT login-gated form) === */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-10">
          <CardHeader>
            <CardTitle className="text-lg text-white font-semibold">
              Student Reviews
            </CardTitle>
            <CardDescription className="text-gray-400">
              What other SMU students say about {data?.host_university}.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Summary bar */}
            <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <StarRating rating={avgRating || 0} />
                <span className="text-white font-semibold">
                  {avgRating ? avgRating.toFixed(2) : "–"}/5
                </span>
              </div>
              <span className="text-gray-300 text-sm">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>

            {/* Existing Reviews */}
            {sortedReviews.length > 0 ? (
              <div className="space-y-4">
                {sortedReviews.map((r: any, i: number) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="font-semibold text-white">{r.name}</p>
                        <span className="text-xs text-gray-400">
                          {timeAgo(r.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={Number(r.rating) || 0} />
                        <span className="text-sm text-gray-300">
                          {(Number(r.rating) || 0).toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                    {r.comment && (
                      <p className="text-gray-300 mt-2">{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">
                No reviews yet. Be the first ✍️
              </p>
            )}

            {/* IMPORTANT: Login-gated submit form */}
            {currentUser ? (
              <div className="bg-white/10 p-4 rounded-lg space-y-4">
                <h3 className="text-white font-semibold">Leave a Review</h3>

                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="Rating out of 5"
                  className="bg-white/20 text-white"
                  value={ratingInput}
                  onChange={(e) => setRatingInput(e.target.value)}
                />

                <Input
                  type="text"
                  placeholder="Your comment"
                  className="bg-white/20 text-white"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />

                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={submitReview}
                >
                  Submit Review ✅
                </Button>
              </div>
            ) : (
              <p className="text-gray-400 italic">
                <a
                  href="/login"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Login
                </a>{" "}
                to leave a review.
              </p>
            )}
          </CardContent>
        </Card>

        {/* === PLAN YOUR STAY & EXPLORE NEARBY === */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-10">
          <CardHeader>
            <CardTitle className="text-lg text-white font-semibold">
              Plan Your Stay & Explore Nearby
            </CardTitle>
            <CardDescription className="text-gray-400">
              Discover nearby accommodations and events — all connected on the
              same interactive map.
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
                  🗺️ Map placeholder — backend to replace with Map API (Google
                  Maps / Mapbox)
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              {/* Price filter temporarily hidden
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
              </div>*/}

              <div>
                <label className="block mb-2 text-gray-400 text-sm">
                  Filter by max distance ({data?.maxDistance ?? "2.0"} km)
                </label>
                <Input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={data?.maxDistance ?? 2.0}
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
                  .filter(
                    (a) =>
                      parseFloat(a.distance) <= (data?.maxDistance ?? 2.0)
                  )
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
                        <h5 className="font-semibold text-lg mb-1">
                          {a.name}
                        </h5>
                        <p className="text-gray-300 text-sm mb-3">
                          {a.distance}km from campus
                        </p>
                        <p>Address: {a.formatted_address}</p>
                        <p>
                          <div>🚗 Driving time: {a.DRIVE}</div>
                          <div>🚶 Walking time: {a.WALK}</div>
                          <div>🚌 Public transport: {a.TRANSIT}</div>
                        </p>
                        <Button
                          asChild
                          className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white no-underline"
                        >
                          <a
                            href="#"
                            title="View on shared map"
                            data-map-marker={a.name}
                          >
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
                {events
                  .filter(
                    (ev) =>
                      parseFloat(ev.distance) <= (data?.maxDistance ?? 2.0)
                  )
                  .map((ev, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-xl w-72 shrink-0 hover:bg-white/10 transition-all duration-200"
                    >
                      <img
                        src={`/images/event_${i + 1}.jpg`}
                        onError={(e) =>
                          ((e.currentTarget as HTMLImageElement).src =
                            ev.thumbnail)
                        }
                        alt={ev.title}
                        className="w-full h-40 object-cover rounded-t-xl"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-1">
                          {ev.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-3">
                          {ev.distance}km from campus
                        </p>
                        <p>Address: {ev.address[0]}</p>
                        <p>
                          <div>🚗 Driving time: {ev.DRIVE}</div>
                          <div>🚶 Walking time: {ev.WALK}</div>
                          <div>🚌 Public transport: {ev.TRANSIT}</div>
                        </p>
                        <Button
                          asChild
                          className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white no-underline"
                        >
                          <a
                            href="#"
                            title="View on shared map"
                            data-map-marker={ev.title}
                          >
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

        {/* Scroll to top */}
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
