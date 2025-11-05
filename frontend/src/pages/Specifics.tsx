import { useState, useEffect } from "react";
import StarRating from "@/components/StarRating";
import StarRatingInput from "@/components/StarRatingInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import AccomodationSkeleton from "@/components/SpecificSchool/AccomodationSkeleton";
import EventsSkeleton from "@/components/SpecificSchool/EventsSkeleton";
const key = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
import { toast } from "sonner";
import { ArrowUpIcon } from "lucide-react";

/* ===========================
   HELPERS (unchanged)
   =========================== */

declare global {
  interface Window {
    google: any;
  }
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

//function scrollToTop() {
//  const topElement = document.getElementById("top");
//  if (topElement) {
//    topElement.scrollIntoView(); // instant scroll
//  }
//}

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

  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [showAllBaskets, setShowAllBaskets] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [distanceCalculated, setDistanceCalculated] = useState(false);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isAccommodationsLoading, setIsAccommodationsLoading] = useState(true);
  /* =========================================================
     LOGIN STATE (IMPORTANT): Use sessionStorage set by LoginForm
     - We read uid/email/name (set after successful login)
     - This is what controls whether the review form shows up
     ========================================================= */
  const [currentUser, setCurrentUser] = useState<null | {
    uid: string;
    email?: string | null;
    name?: string | null;
  }>(null);

  const [showMap, setShowMap] = useState(false);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [updateRequired, setUpdateRequired] = useState(false);

  const [new_obj, set_new_obj] = useState<Record<string, any>>({});

  async function get_cooridnates(address: string) {
    try {
      const response = await axios.get(
        `https://smuxchange-backend.vercel.app/api/geocoding/${address}`
      );
      return response.data.results[0].geometry.location;
    } catch (err) {
      console.log(err);
    }
  }

  function handleShowMap(address: string) {
    return async (e: React.MouseEvent) => {
      e.preventDefault();
      const coords = await get_cooridnates(address);
      if (coords) {
        setMapCoords(coords);
        setShowMap(true);
        setUpdateRequired(true);

        setTimeout(() => {
            const mapElement = document.getElementById("map-section");
            if (mapElement) {
                mapElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "nearest"    
                });
            }
            setUpdateRequired(false);
        },100)

      }
    };
  }

  function on_event_click(item_selected: Record<string, any>) {
    return (e: React.MouseEvent) => {
        set_new_obj(item_selected);
        if (item_selected.type == "accomodation") {
            return handleShowMap(item_selected.formatted_address)(e);
        } else {
            return handleShowMap(item_selected.address[0])(e)
        }
    }
  }


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
  const [ratingInput, setRatingInput] = useState<number>(0);
  const [commentInput, setCommentInput] = useState<string>("");

  /* ========== Scroll listener (unchanged) ========== */
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 200) {
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
        `https://smuxchange-backend.vercel.app/api/events/${data.city}/${data.country}`
      );
      setEvents(
        Array.isArray(response_data.data.events_results)
          ? response_data.data.events_results
          : []
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function get_accomodations() {
    try {
      const response_data = await axios.get(
        `https://smuxchange-backend.vercel.app/api/apartments/${data.host_university}`
      );
      setAccommodations(
        Array.isArray(response_data.data) ? response_data.data : []
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchReviews() {
    try {
      if (!data?.host_university) return;
      const url = `https://smuxchange-backend.vercel.app/database/getReviews/${encodeURIComponent(
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

      await axios.post(
        "https://smuxchange-backend.vercel.app/database/saveReview",
        payload
      );

      // reset inputs + refresh list
      setCommentInput("");
      await fetchReviews();
      toast.success("Review submitted!", {
        description: "Your review has been submitted successfully.",
      });
    } catch (e) {
      console.log("Error submitting review:", e);
      toast.error("Failed to submit review.", {
        description: "Error: " + (e as any).response?.data?.error,
      });
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
          `https://smuxchange-backend.vercel.app/api/distance/${origin}/${destination}/${mode_values[i]}`
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
        "type": "accomodation"
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
        "type": "event"
      });
    }
    updatedAccomodations.sort((a, b) => a.distance - b.distance);
    updatedEvents.sort((a, b) => a.distance - b.distance);

    setAccommodations(
      Array.isArray(updatedAccomodations) ? updatedAccomodations : []
    );
    setEvents(Array.isArray(updatedEvents) ? updatedEvents : []);
    setIsAccommodationsLoading(false);
    setIsEventsLoading(false);
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
      if ((accommodations.length > 0  || events.length>0 )&& !distanceCalculated) {
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* === Subtle gradient + grid overlay === */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,43,114,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="container mx-auto px-6 py-12 space-y-10 relative z-10">
        <div id="top" />
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: "#102b72" }}
            >
              {data && data.host_university}
            </h1>
            <div className="flex items-center gap-3">
              <img
                src={`https://flagcdn.com/${getCountryCode(data?.country)}.svg`}
                alt={data && data.country}
                className="w-6 h-5 rounded-md"
              />
              <span style={{ color: "#102b72" }}>{data && data.country}</span>
            </div>
          </div>
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
        <Card className="bg-white/80 backdrop-blur-md border-[#102b72]/20">
          <CardHeader>
            <CardTitle
              className="text-2xl font-semibold"
              style={{ color: "#102b72" }}
            >
              About the University
            </CardTitle>
            <CardDescription
              className="leading-relaxed"
              style={{ color: "#102b72" }}
            >
              {data?.description || "No description available."}
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-4 space-y-6">
            {/* === ROW 1: Email | Phone | Rating === */}

            {/* Rating */}
            <div className="text-center">
              <p className="text-sm" style={{ color: "#102b72", opacity: 0.7 }}>
                Rating
              </p>
              <div className="flex items-center gap-2 justify-center">
                <StarRating rating={avgRating || 0} />
                <span className="text-sm" style={{ color: "#102b72" }}>
                  {avgRating ? avgRating.toFixed(1) + "/5.0" : "No ratings yet"}{" "}
                  ({reviews.length} review{reviews.length === 1 ? "" : "s"})
                </span>
              </div>
            </div>
            {/* GPA Requirements */}
            <div className="text-center">
              <p className="text-sm" style={{ color: "#102b72", opacity: 0.7 }}>
                GPA Requirements
              </p>
              <div className="flex flex-wrap gap-4 text-sm font-semibold mt-1 justify-center">
                <span style={{ color: "#16a34a" }}>
                  Max GPA: {data?.max_gpa ?? "N/A"}
                </span>
                <span style={{ color: "#dc2626" }}>
                  Min GPA: {data?.min_gpa ?? "N/A"}
                </span>
                <span style={{ color: "#2563eb" }}>
                  Places: {data?.places ?? "N/A"}
                </span>
              </div>
            </div>
            <div className="text-center">
              <Link to={`/mappable/${data?.host_university}/${data?.country}`}>
                <button
                  className="font-semibold hover:scale-105 transition-transform px-8 py-2 text-lg"
                  style={{ backgroundColor: "#102b72", color: "#ffffff" }}
                >
                  Try Map
                </button>
              </Link>
            </div>

            {/* Optional Empty Column (keeps layout balanced) */}
            <div></div>
          </CardContent>
        </Card>

        {/* === AVAILABLE COURSE AREAS (with show more/less) === */}
        <Card className="bg-white/80 backdrop-blur-md border-[#102b72]/20 mt-10">
          <CardHeader>
            <CardTitle
              className="text-lg font-semibold"
              style={{ color: "#102b72" }}
            >
              Available Course Areas
            </CardTitle>
            <CardDescription style={{ color: "#102b72" }}>
              Course areas mapped for this university
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 transition-all duration-500 overflow-hidden ${
                  showAllBaskets
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-[260px] opacity-95"
                }`}
              >
                {data &&
                  data.mappable_basket?.map((basket: string, i: number) => (
                    <div key={i} className="flex">
                      <span
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-[#102b72]/30 bg- hover:bg-[#102b72]/10 transition-colors w-full text-center"
                        style={{ color: "#102b72" }}
                      >
                        {basket}
                      </span>
                    </div>
                  ))}
                {(!data ||
                  !data.mappable_basket ||
                  data.mappable_basket.length === 0) && (
                  <span
                    className="text-sm italic"
                    style={{ color: "#102b72", opacity: 0.7 }}
                  >
                    No course areas available.
                  </span>
                )}
              </div>

              {data && data.mappable_basket?.length > 6 && (
                <button
                  onClick={() => setShowAllBaskets((prev) => !prev)}
                  className="flex items-center gap-2 px-5 py-2 mt-5 rounded-full text-sm font-semibold hover:bg-[#102b72]/10 transition-all"
                  style={{
                    color: "#102b72",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(16,43,114,0.3)",
                  }}
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
        <Card className="bg-white/80 backdrop-blur-md border-[#102b72]/20 mt-10">
          <CardHeader>
            <CardTitle
              className="text-lg font-semibold"
              style={{ color: "#102b72" }}
            >
              Student Reviews
            </CardTitle>
            <CardDescription style={{ color: "#102b72" }}>
              What other SMU students say about {data?.host_university}.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Summary bar */}
            <div className="flex items-center justify-between bg-white border border-[#102b72]/20 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <StarRating rating={avgRating || 0} />
                <span className="font-semibold" style={{ color: "#102b72" }}>
                  {avgRating ? avgRating.toFixed(1) + "/5.0" : ""}
                </span>
              </div>
              <span className="text-sm" style={{ color: "#102b72" }}>
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>

            {/* Existing Reviews */}
            {sortedReviews.length > 0 ? (
              <div className="space-y-4">
                {sortedReviews.map((r: any, i: number) => (
                  <div
                    key={i}
                    className="bg-white border border-[#102b72]/20 p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://avatar.iran.liara.run/username?username=${encodeURIComponent(
                            r.name
                          )}`}
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                          decoding="async"
                          width={24}
                          height={24}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/images/university.jpg";
                          }}
                        />
                        <span
                          className="font-semibold"
                          style={{ color: "#102b72" }}
                        >
                          {r.name}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "#102b72", opacity: 0.7 }}
                        >
                          {timeAgo(r.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={Number(r.rating) || 0} />
                        <span className="text-sm" style={{ color: "#102b72" }}>
                          {(Number(r.rating) || 0).toFixed(1)}/5.0
                        </span>
                      </div>
                    </div>
                    {r.comment && (
                      <p className="mt-2" style={{ color: "#102b72" }}>
                        {r.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic" style={{ color: "#102b72", opacity: 0.7 }}>
                No reviews yet. Be the first ✍️
              </p>
            )}

            {/* IMPORTANT: Login-gated submit form */}
            {currentUser ? (
              <div className="bg-white/95 border border-[#102b72]/20 p-6 rounded-2xl shadow-sm space-y-5 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-[#102b72]">
                  Leave a Review
                </h3>

                {/* ⭐ Star Rating Input */}
                <div className="flex items-center gap-2">
                  <StarRatingInput
                    value={ratingInput}
                    onChange={setRatingInput}
                  />
                  <span className="text-sm text-gray-600 mt-[2px]">
                    {ratingInput > 0
                      ? `${ratingInput}/5`
                      : "Tap a star to rate"}
                  </span>
                </div>

                {/* 📝 Comment box */}
                <textarea
                  placeholder="Share your thoughts about this university..."
                  className="w-full min-h-[90px] resize-none rounded-lg border border-[#102b72]/30 p-3 text-[#102b72] text-sm focus:ring-2 focus:ring-[#102b72] focus:border-transparent outline-none transition"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />

                {/* ✅ Submit Button */}
                <div className="flex justify-end">
                  <Button
                    disabled={ratingInput === 0}
                    onClick={submitReview}
                    className={`font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 ${
                      ratingInput === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-[#102b72] hover:bg-[#0d2360] text-white"
                    }`}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className="italic text-center"
                style={{ color: "#102b72", opacity: 0.8 }}
              >
                <Link
                  to="/login"
                  className="underline font-semibold hover:text-[#2563eb]"
                  style={{ color: "#2563eb" }}
                >
                  Login
                </Link>{" "}
                to leave a review.
              </p>
            )}
          </CardContent>
        </Card>

        {/* === PLAN YOUR STAY & EXPLORE NEARBY === */}

        <Card className="bg-white/80 backdrop-blur-md border-[#102b72]/20 mt-10">
          <div id="map-section">
            <CardHeader>
              <CardTitle
                className="text-lg font-semibold"
                style={{ color: "#102b72" }}
              >
                Plan Your Stay & Explore Nearby
              </CardTitle>
              <CardDescription style={{ color: "#102b72" }}>
                Discover nearby accommodations and events — all connected on the
                same interactive map.
              </CardDescription>
            </CardHeader>

            {new_obj && new_obj.type == "accomodation" &&(
                <div className="mt-4 p-3 bg-[#102b72]/10 rounded-md text-[#102b72]">
                    <strong>Currently Selected {new_obj.type}:</strong> {new_obj.name}<br/>
                    <strong> Currently Selected Address: </strong> {new_obj.formatted_address}
                    </div>
            )}

            {new_obj && new_obj.type == "event" &&(
                 <div className="mt-4 p-3 bg-[#102b72]/10 rounded-md text-[#102b72]">
                    <strong>Currently Selected {new_obj.type}</strong>: {new_obj.title}<br/>
                    <strong>Currently Selected Address: </strong>{new_obj.address[0]}
                    </div>
            )}


          </div>

          <CardContent className="space-y-6">
            {/* Map Placeholder */}
            {!showMap && (
              <div className="mapplaceholder relative w-full h-96 rounded-xl overflow-hidden border border-[#102b72]/20 shadow-lg">
                <img
                  src="/images/map_placeholder_api.jpg"
                  alt="Interactive Map Placeholder"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent flex items-end justify-center p-4">
                </div>
              </div>
            )}

            {showMap && mapCoords && (
              <APIProvider apiKey={key}>
                <Map
                  style={{
                    width: "100%",
                    height: "384px",
                    borderRadius: "1rem",
                    position: "relative",
                  }}
                  center={updateRequired ? mapCoords : undefined}
                  zoom={updateRequired?16:undefined}

                  defaultCenter={!updateRequired?mapCoords:undefined}
                  defaultZoom={!updateRequired?16:undefined}

                  mapId="DEMO_MAP_ID"
                  disableDefaultUI={false}
                  gestureHandling="greedy"
                >
                  <AdvancedMarker
                    position={mapCoords}
                    title="Selected Location"
                  >
                    <Pin
                      background="#FFD700"
                      glyphColor="#000"
                      borderColor="#000"
                    />
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            )}

            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block mb-2 text-gray-400 text-sm">
                  Filter by max distance ({data.maxDistance ?? "20"} km)
                </label>
                <Input
                  type="range"
                  min={0.5}
                  max={20}
                  step={0.5}
                  value={data.maxDistance ?? 20}
                  onChange={(e) =>
                    setData((prev: any) => ({
                      ...prev,
                      maxDistance: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full"
                  style={{ accentColor: "#102b72" }}
                />
              </div>
            </div>

            {/* Accommodations */}
            <div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: "#102b72" }}
              >
                Nearby Accommodations
              </h3>

              <div className="w-full">
                <div className="flex overflow-x-auto gap-4 pb-3 snap-x snap-proximity">
                  {isAccommodationsLoading ? (
                    <AccomodationSkeleton />
                  ) : (
                    accommodations
                      .filter(
                        (a) =>
                          parseFloat(a.distance) <= (data.maxDistance ?? 20)
                      )
                      .map((a, i) => (
                        <div
                          key={i}
                         className={`card shrink-0 w-72 snap-center flex flex-col transition-all duration-200
                            ${new_obj === a ? 'bg-white border border-5 text-white shadow border-primary rounded' : 'bg-white border border-[#102b72]/20 hover:shadow-md hover:-translate-y-1'}`}
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
                          <div className="flex flex-col justify-between flex-grow p-4">
                            <div>
                              <h5
                                className="font-semibold text-lg mb-1"
                                style={{ color: "#102b72" }}
                              >
                                {a.name}
                              </h5>
                              <p
                                className="text-sm mb-3"
                                style={{ color: "#102b72", opacity: 0.7 }}
                              >
                                {a.distance}km from campus
                              </p>
                              <p
                                className="text-sm mb-2"
                                style={{ color: "#102b72" }}
                              >
                                Address: {a.formatted_address}
                              </p>
                              <div
                                className="space-y-1 text-sm"
                                style={{ color: "#102b72" }}
                              >
                                <div>
                                  🚗 Driving time:{" "}
                                  {!a.DRIVE ||
                                  String(a.DRIVE)
                                    .toLowerCase()
                                    .includes("nan") ? (
                                    <span
                                      style={{
                                        color: "#b91c1c",
                                        fontWeight: 600,
                                      }}
                                    >
                                      N/A
                                    </span>
                                  ) : (
                                    a.DRIVE
                                  )}
                                </div>
                                <div>
                                  🚶 Walking time:{" "}
                                  {!a.WALK ||
                                  String(a.WALK)
                                    .toLowerCase()
                                    .includes("nan") ? (
                                    <span
                                      style={{
                                        color: "#b91c1c",
                                        fontWeight: 600,
                                      }}
                                    >
                                      N/A
                                    </span>
                                  ) : (
                                    a.WALK
                                  )}
                                </div>
                                <div>
                                  🚌 Public transport:{" "}
                                  {!a.TRANSIT ||
                                  String(a.TRANSIT)
                                    .toLowerCase()
                                    .includes("nan") ? (
                                    <span
                                      style={{
                                        color: "#b91c1c",
                                        fontWeight: 600,
                                      }}
                                    >
                                      N/A
                                    </span>
                                  ) : (
                                    a.TRANSIT
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-2">
                              <Button
                                onClick={on_event_click(a)}
                                asChild
                                className="w-full text-sm font-semibold no-underline rounded-lg"
                                style={{
                                  backgroundColor: "#102b72",
                                  color: "#ffffff",
                                }}
                              >
                                <a
                                  href="#"
                                  title="View on shared map"
                                  data-map-marker={a.name}
                                  style={{
                                    textDecoration: "none",
                                    color: "#ffffff",
                                  }}
                                >
                                  📍 View on Map
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {!isAccommodationsLoading &&
                  accommodations.filter(
                    (a) => parseFloat(a.distance) <= (data.maxDistance ?? 20)
                  ).length === 0 && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
                      No accommodations found
                    </div>
                  )}
              </div>
            </div>

            {/* Events */}
            <div className="mt-10">
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: "#102b72" }}
              >
                Nearby Events & Activities
              </h3>

              <div className="w-full">
                <div className="flex overflow-x-auto gap-4 pb-3 snap-x snap-proximity">
                  {isEventsLoading ? (
                    <EventsSkeleton />
                  ) : (
                    events
                      .filter(
                        (ev) =>
                          parseFloat(ev.distance) <= (data.maxDistance ?? 20)
                      )
                      .map((ev, i) => (
                        <div
                          key={i}
                          className={`rounded-xl card shrink-0 w-72 snap-center flex flex-col transition-all duration-200
                            ${new_obj === ev ? 'bg-white border border-5 text-white shadow border-primary rounded' : 'bg-white border border-[#102b72]/20 hover:shadow-md hover:-translate-y-1'}`}
                        >
                          <img
                            src={ev.thumbnail}
                            alt={ev.title}
                            className="h-40 object-cover rounded-t-xl"
                          />
                          <div className="flex flex-col justify-between flex-grow p-4">
                            <div>
                              <h4
                                className="font-semibold text-lg mb-1"
                                style={{ color: "#102b72" }}
                              >
                                {ev.title}
                              </h4>
                              <p
                                className="text-sm mb-3"
                                style={{ color: "#102b72", opacity: 0.7 }}
                              >
                                {ev.distance}km from campus
                              </p>
                              <p
                                className="text-sm mb-2"
                                style={{ color: "#102b72" }}
                              >
                                Address: {ev.address[0]}
                              </p>
                              <div
                                className="space-y-1 text-sm"
                                style={{ color: "#102b72" }}
                              >
                                <div>
                                  🚗 Driving time:{" "}
                                  {!ev.DRIVE ||
                                  String(ev.DRIVE)
                                    .toLowerCase()
                                    .includes("nan") ? (
                                    <span
                                      style={{
                                        color: "#b91c1c",
                                        fontWeight: 600,
                                      }}
                                    >
                                      N/A
                                    </span>
                                  ) : (
                                    ev.DRIVE
                                  )}
                                </div>
                                <div>
                                  🚶 Walking time:{" "}
                                  {!ev.WALK ||
                                  String(ev.WALK)
                                    .toLowerCase()
                                    .includes("nan") ? (
                                    <span
                                      style={{
                                        color: "#b91c1c",
                                        fontWeight: 600,
                                      }}
                                    >
                                      N/A
                                    </span>
                                  ) : (
                                    ev.WALK
                                  )}
                                </div>
                                <div>
                                  🚌 Public transport:{" "}
                                  {!ev.TRANSIT ||
                                  String(ev.TRANSIT)
                                    .toLowerCase()
                                    .includes("nan") ? (
                                    <span
                                      style={{
                                        color: "#b91c1c",
                                        fontWeight: 600,
                                      }}
                                    >
                                      N/A
                                    </span>
                                  ) : (
                                    ev.TRANSIT
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-2">
                              <Button
                                onClick={on_event_click(ev)}
                                asChild
                                className="w-full text-sm font-semibold no-underline rounded-lg"
                                style={{
                                  backgroundColor: "#102b72",
                                  color: "#ffffff",
                                }}
                              >
                                <a
                                  href="#"
                                  title="View on shared map"
                                  data-map-marker={ev.title}
                                  style={{
                                    textDecoration: "none",
                                    color: "#ffffff",
                                  }}
                                >
                                  🎯 View on Map
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {!isEventsLoading &&
                  events.filter(
                    (ev) => parseFloat(ev.distance) <= (data.maxDistance ?? 20)
                  ).length === 0 && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
                      No events found
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scroll to top */}
        {showScrollButton && (
          <button
            onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
            className="rounded fixed bottom-8 right-8 z-50 h-14 w-14 flex items-center justify-center rounded-2xl shadow-2xl bg-gradient-to-br from-green-200 to-blue-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="Scroll to top"
          >
            <ArrowUpIcon className="w-5 h-5" style={{ color: "#ffffff"}} />
          </button>
        )}
      </div>
    </div>
  );
}
