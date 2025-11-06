import React, { useState, useEffect, useRef } from "react";
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
import { ArrowUpIcon, Send, MapPin, Car, Footprints, Bus, Route } from "lucide-react";

/* ===========================
   TYPING ANIMATION
   =========================== */
function TypingAnimation({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="leading-none font-extrabold" style={{ fontFamily: 'inherit' }}>
      {displayedText}
      <span className={showCursor ? "opacity-100" : "opacity-0"}>|</span>
    </span>
  );
}

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
    poland : "pl",
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


function useScrollAnimation() {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-scroll-id");
            if (id) {
              setVisible((prev) => ({ ...prev, [id]: true }));
              // Unobserve after it's visible to improve performance
              if (observerRef.current) {
                observerRef.current.unobserve(entry.target);
              }
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe all elements with data-scroll-id
    const elements = document.querySelectorAll("[data-scroll-id]");
    elements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        elements.forEach((el) => observerRef.current?.unobserve(el));
      }
    };
  }, []);

  const setRef = (_id: string) => (element: HTMLDivElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  return { setRef, visible };
}

/* ===========================
   MAIN COMPONENT
   =========================== */
export default function Specifics() {
  /* ========== School data (unchanged) ========== */
  const { setRef, visible } = useScrollAnimation();
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

  // Scroll tracking for pagination dots
  const [accomScrollIndex, setAccomScrollIndex] = useState(0);
  const [eventsScrollIndex, setEventsScrollIndex] = useState(0);
  const accomScrollRef = useRef<HTMLDivElement>(null);
  const eventsScrollRef = useRef<HTMLDivElement>(null);

  // Carousel pagination helpers
  const CARD_WIDTH_PX = 288 + 16; // w-72 (288px) + gap-4 (16px)
  const getFilteredAccommodations = () =>
    accommodations.filter((a) => parseFloat(a.distance) <= (data.maxDistance ?? 20));
  const getFilteredEvents = () =>
    events.filter((ev) => parseFloat(ev.distance) <= (data.maxDistance ?? 20));
  const getVisibleCount = (container: HTMLDivElement | null) =>
    Math.max(1, Math.floor((container?.clientWidth || CARD_WIDTH_PX) / CARD_WIDTH_PX));
  const getTotalPages = (itemsCount: number, container: HTMLDivElement | null) => {
    const visible = getVisibleCount(container);
    return Math.max(1, itemsCount - visible + 1);
  };

  // Mouse drag-to-scroll state (accommodations)
  const [isAccomDragging, setIsAccomDragging] = useState(false);
  const accomDragRef = useRef<{ startX: number; scrollLeft: number }>({ startX: 0, scrollLeft: 0 });
  const onAccomMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = accomScrollRef.current;
    if (!container) return;
    setIsAccomDragging(true);
    accomDragRef.current.startX = e.pageX - container.offsetLeft;
    accomDragRef.current.scrollLeft = container.scrollLeft;
  };
  const onAccomMouseLeave = () => setIsAccomDragging(false);
  const onAccomMouseUp = () => setIsAccomDragging(false);
  const onAccomMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = accomScrollRef.current;
    if (!container || !isAccomDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - accomDragRef.current.startX;
    container.scrollLeft = accomDragRef.current.scrollLeft - walk;
  };

  // Mouse drag-to-scroll state (events)
  const [isEventsDragging, setIsEventsDragging] = useState(false);
  const eventsDragRef = useRef<{ startX: number; scrollLeft: number }>({ startX: 0, scrollLeft: 0 });
  const onEventsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = eventsScrollRef.current;
    if (!container) return;
    setIsEventsDragging(true);
    eventsDragRef.current.startX = e.pageX - container.offsetLeft;
    eventsDragRef.current.scrollLeft = container.scrollLeft;
  };
  const onEventsMouseLeave = () => setIsEventsDragging(false);
  const onEventsMouseUp = () => setIsEventsDragging(false);
  const onEventsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = eventsScrollRef.current;
    if (!container || !isEventsDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - eventsDragRef.current.startX;
    container.scrollLeft = eventsDragRef.current.scrollLeft - walk;
  };

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

  // Scroll handlers for pagination dots
  const handleAccomScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const totalPages = getTotalPages(getFilteredAccommodations().length, container);
    const index = Math.min(totalPages - 1, Math.max(0, Math.round(scrollLeft / CARD_WIDTH_PX)));
    setAccomScrollIndex(index);
  };

  const handleEventsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const totalPages = getTotalPages(getFilteredEvents().length, container);
    const index = Math.min(totalPages - 1, Math.max(0, Math.round(scrollLeft / CARD_WIDTH_PX)));
    setEventsScrollIndex(index);
  };


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
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);

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


      const payload = {
        uid: currentUser?.uid || "anonymous_user",
        name: currentUser?.name || "anonymous_user",
        university: data?.host_university,
        rating: Number(ratingInput),
        comment: commentInput || "",
        createdAt: Date.now(), // client timestamp for UI sorting (backend also tracks updated_at)
      };

      const loadingToast = toast.loading("Submitting review...");
      await axios.post(
        "https://smuxchange-backend.vercel.app/database/saveReview",
        payload
      );
      // Dismiss loading toast before showing success
      toast.dismiss(loadingToast);
      // reset inputs + refresh list
      setCommentInput("");
      await fetchReviews();
      toast.success("Review submitted!", {
        description: "Your review has been submitted successfully.",
      });
    } catch (e) {
      // Dismiss any existing loading toast on error
      toast.dismiss();
      console.log("Error submitting review:", e);
      toast.warning("Failed to submit review.", {
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
    
      <div className="container mx-auto px-6 py-5 space-y-10 relative z-10">
        <div id="top" />
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-none bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: 'inherit' }}>
              {data && <TypingAnimation text={data.host_university} speed={100} />}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <img
                src={`https://flagcdn.com/${getCountryCode(data?.country)}.svg`}
                alt={data && data.country}
                className="w-10 h-8 rounded-md animate-flag-wave"
              />
              <span className="text-slate-700 font-medium text-lg">{data && data.country}</span>
            </div>
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <a
                href="#about"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/80 backdrop-blur-md border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105 text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                About
              </a>
              <a
                href="#course-areas"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/80 backdrop-blur-md border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105 text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('course-areas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Course Areas
              </a>
              <a
                href="#reviews"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/80 backdrop-blur-md border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105 text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Student Reviews
              </a>
              <a
                href="#explore"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/80 backdrop-blur-md border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105 text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Explore Nearby
              </a>
            </div>
          </div>
        </div>

        {/* === HERO IMAGE === */}
        <div 
          ref={setRef("hero-image")}
          data-scroll-id="hero-image"
          className={`relative w-full h-80 overflow-hidden rounded-2xl shadow-lg scroll-fade-in ${visible["hero-image"] ? "visible" : ""}`}
        >
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
        <Card 
          id="about"
          ref={setRef("details-card")}
          data-scroll-id="details-card"
          className={`bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl scroll-fade-in ${visible["details-card"] ? "visible" : ""}`}
        >
          <CardHeader>
            <CardTitle
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent"
            >
              About the University
            </CardTitle>
            <CardDescription className="leading-relaxed text-slate-600">
              {data?.description || "No description available."}
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-4 space-y-6">
            {/* === ROW 1: Email | Phone | Rating === */}

            {/* Rating */}
            <div className="text-center bg-gradient-to-br from-blue-100 to-emerald-100 border-2 border-blue-300 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                Rating
              </p>
              <div className="flex items-center gap-3 justify-center mb-2">
                <StarRating rating={avgRating || 0} />
              </div>
              <span className="text-lg font-bold text-slate-800 bg-white px-4 py-2 rounded-lg inline-block shadow-md">
                {avgRating ? avgRating.toFixed(1) + "/5.0" : "No ratings yet"}{" "}
                ({reviews.length} review{reviews.length === 1 ? "" : "s"})
              </span>
            </div>
            {/* GPA Requirements */}
            <div className="text-center bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                GPA Requirements
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-br from-emerald-200 to-green-200 text-emerald-800 border border-emerald-400 shadow-md hover:scale-105 transition-all duration-200 hover:shadow-lg">
                  Max GPA: {data?.max_gpa ?? "N/A"}
                </span>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-br from-red-200 to-rose-200 text-red-800 border border-red-400 shadow-md hover:scale-105 transition-all duration-200 hover:shadow-lg">
                  Min GPA: {data?.min_gpa ?? "N/A"}
                </span>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-br from-blue-200 to-indigo-200 text-blue-800 border border-blue-400 shadow-md hover:scale-105 transition-all duration-200 hover:shadow-lg">
                  Places: {data?.places ?? "N/A"}
                </span>
              </div>
            </div>
            <div className="text-center">
              <Link to={`/mappable/${data?.host_university}/${data?.country}`}>
                <button
                  className="font-semibold hover:scale-105 transition-transform px-8 py-2 text-lg bg-blue-600 text-white hover:bg-blue-700 rounded shadow-lg"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Map Now
                  </span>
                </button>
              </Link>
            </div>

            {/* Optional Empty Column (keeps layout balanced) */}
            <div></div>
          </CardContent>
        </Card>

        {/* === AVAILABLE COURSE AREAS (with show more/less) === */}
        <Card 
          id="course-areas"
          ref={setRef("course-areas")}
          data-scroll-id="course-areas"
          className={`bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl mt-10 scroll-fade-in ${visible["course-areas"] ? "visible" : ""}`}
        >
          <CardHeader>
            <CardTitle
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent"
            >
              Available Course Areas
            </CardTitle>
            <CardDescription className="text-slate-600">
              Course areas mapped for this university.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-full border-2 border-slate-300 rounded-xl p-3 bg-gradient-to-br from-slate-50 to-slate-100">
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
                          className="px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200 bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 text-blue-900 shadow-sm hover:shadow-md transition-colors w-full text-center"
                        >
                          {basket}
                        </span>
                      </div>
                    ))}
                  {(!data ||
                    !data.mappable_basket ||
                    data.mappable_basket.length === 0) && (
                    <span className="block w-full md:col-span-3 text-center text-sm italic text-slate-600">
                      No course areas available.
                    </span>
                  )}
                </div>
              </div>

              {data && data.mappable_basket?.length > 6 && (
                <button
                  onClick={() => setShowAllBaskets((prev) => !prev)}
                  className="flex items-center gap-2 px-5 py-2 mt-5 rounded-full text-sm font-semibold text-blue-600"
                  style={{
                    backgroundColor: "transparent",
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
        <Card 
          id="reviews"
          ref={setRef("reviews-card")}
          data-scroll-id="reviews-card"
          className={`bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl mt-10 scroll-fade-in ${visible["reviews-card"] ? "visible" : ""}`}
        >
          <CardHeader>
            <CardTitle
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent"
            >
              Student Reviews
            </CardTitle>
            <CardDescription className="text-slate-600">
              What other SMU students say about {data?.host_university}.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Summary bar */}
            <div className="flex items-center justify-between bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3">
                <StarRating rating={avgRating || 0} />
                <span className="font-semibold text-slate-700">
                  {avgRating ? avgRating.toFixed(1) + "/5.0" : ""}
                </span>
              </div>
              <span className="text-sm text-slate-700 font-medium">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>

            {/* Existing Reviews */}
            {sortedReviews.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className={`space-y-4 transition-all duration-500 overflow-hidden ${showAllReviews ? "max-h-[2000px] opacity-100" : "max-h-[260px] opacity-95"}`}>
                  {sortedReviews.map((r: any, i: number) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-xl p-4 shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                          <span className="font-semibold text-slate-700">
                            {r.name}
                          </span>
                          <span className="text-xs text-slate-600">
                            {timeAgo(r.createdAt)}
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-300 rounded-lg font-semibold text-sm text-blue-900 shadow-sm">
                          <StarRating rating={Number(r.rating) || 0} />
                          <span>
                            {(Number(r.rating) || 0).toFixed(1)}/5.0
                          </span>
                        </div>
                      </div>
                      {r.comment && (
                        <p className="mt-2 text-slate-700">
                          {r.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {sortedReviews.length > 0 && (
                  <button
                    className="flex items-center gap-2 px-5 py-2 mt-5 rounded-full text-sm font-semibold text-blue-600"
                    onClick={() => setShowAllReviews((prev) => !prev)}
                  >
                    {showAllReviews ? (
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
            ) : (
              <p className="italic text-slate-600">
                No reviews yet. Be the first ✍️
              </p>
            )}

            {/* IMPORTANT: Login-gated submit form */}
            {currentUser ? (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-xl p-4 shadow-md space-y-5 max-w-2xl mx-auto">
                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
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
                  className="w-full min-h-[90px] resize-none rounded-lg border border-blue-300 p-3 text-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />

                {/* ✅ Submit Button */}
                <div className="flex justify-end">
                  <Button
                    disabled={ratingInput === 0}
                    onClick={submitReview}
                    className={`bg-blue-600 text-white font-bold px-6 py-2 rounded shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 ${
                      ratingInput === 0
                        ? "!bg-gray-300 !text-gray-600 cursor-not-allowed"
                        : "hover:scale-110 active:scale-105"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Review
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="italic text-center text-slate-600">
                <Link
                  to="/login"
                  className="underline font-semibold text-blue-600 hover:text-blue-700"
                >
                  Login
                </Link>{" "}
                to leave a review.
              </p>
            )}
          </CardContent>
        </Card>

        {/* === PLAN YOUR STAY & EXPLORE NEARBY === */}

        <Card 
          id="explore"
          ref={setRef("plan-stay")}
          data-scroll-id="plan-stay"
          className={`bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl mt-10 scroll-fade-in ${visible["plan-stay"] ? "visible" : ""}`}
        >
          <div id="map-section">
            <CardHeader>
              <CardTitle
                className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent"
              >
                Plan Your Stay & Explore Nearby
              </CardTitle>
              <CardDescription className="text-slate-600">
                Discover nearby accommodations and events — all connected on the
                same interactive map.
              </CardDescription>
            </CardHeader>

            {new_obj && new_obj.type == "accomodation" &&(
                <div className="mt-4 mx-auto max-w-2xl p-4 bg-blue-50 rounded-lg text-blue-600 border border-blue-200 shadow-sm">
                    <div className="space-y-2">
                        <div>
                            <strong>Currently Selected Accommodation:</strong> {new_obj.name}
                        </div>
                        <div>
                            <strong>Currently Selected Address:</strong> {new_obj.formatted_address}
                        </div>
                    </div>
                </div>
            )}

            {new_obj && new_obj.type == "event" &&(
                 <div className="mt-4 mx-auto max-w-2xl p-4 bg-blue-50 rounded-lg text-blue-600 border border-blue-200 shadow-sm">
                    <div className="space-y-2">
                        <div>
                            <strong>Currently Selected Event:</strong> {new_obj.title}
                        </div>
                        <div>
                            <strong>Currently Selected Address:</strong> {new_obj.address[0]}
                        </div>
                    </div>
                </div>
            )}


          </div>

          <CardContent className="space-y-6">
            {/* Map Placeholder */}
            {!showMap && (
              <div className="mapplaceholder relative w-full h-96 rounded-xl overflow-hidden border border-blue-200 shadow-lg">
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
                  style={{ accentColor: "#2563eb" }}
                />
              </div>
            </div>

            {/* Accommodations */}
            <div>
              <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent mb-3">
                Nearby Accommodations
              </CardTitle>

              <div className="w-full">
                <div 
                  ref={accomScrollRef}
                  onScroll={handleAccomScroll}
                  onMouseDown={onAccomMouseDown}
                  onMouseLeave={onAccomMouseLeave}
                  onMouseUp={onAccomMouseUp}
                  onMouseMove={onAccomMouseMove}
                  className="flex overflow-x-auto no-scrollbar gap-4 pb-3 snap-x snap-proximity border-2 border-slate-300 rounded-xl p-3 select-none cursor-grab active:cursor-grabbing bg-gradient-to-br from-slate-50 to-slate-100"
                >
                  {isAccommodationsLoading ? (
                    <AccomodationSkeleton />
                  ) : accommodations
                      .filter(
                        (a) =>
                          parseFloat(a.distance) <= (data.maxDistance ?? 20)
                      ).length === 0 ? (
                    <div className="w-full text-center py-12">
                      <span className="block text-sm italic text-slate-600">No accommodations found.</span>
                      <span className="block text-sm italic text-slate-600 mt-1">Try adjusting the distance filter above.</span>
                    </div>
                  ) : (
                    accommodations
                      .filter(
                        (a) =>
                          parseFloat(a.distance) <= (data.maxDistance ?? 20)
                      )
                      .map((a, i) => (
                        <div
                          key={i}
                         className={`card shrink-0 w-72 snap-center flex flex-col transition-all duration-200 rounded-xl
                            ${new_obj === a ? 'bg-white border-4 border-black shadow shadow-black/50' : 'bg-white border border-blue-200 hover:shadow-md hover:-translate-y-1'}`}
                        >
                          <div className="w-full h-40 rounded-t-xl overflow-hidden bg-slate-100">
                            <img
                              src={`/images/accom/accom${(i % 5) + 1}.jpg`}
                              alt={a.name}
                              className="w-full h-40 object-cover"
                              onError={(e) => {
                                ((e.currentTarget as HTMLImageElement).src = "/images/accommodations_placeholder.jpg");
                              }}
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-col justify-between flex-grow p-4">
                            <div>
                              <h5 className="font-semibold text-xl mb-1 text-blue-700">
                                {a.name}
                              </h5>
                              <div className="text-sm mb-2 text-slate-700 inline-flex items-center gap-2">
                                <Route className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">{a.distance} km</span>
                                <span className="text-slate-500">from campus</span>
                              </div>
                              <div className="text-sm mb-3 text-slate-700 inline-flex items-center gap-2 min-w-0">
                                <MapPin className="w-4 h-4 text-rose-500" />
                                <span className="whitespace-normal break-words">
                                  {a.formatted_address}
                                </span>
                              </div>
                              <div className="space-y-1.5 text-sm text-slate-700">
                                <div className="inline-flex items-center gap-2">
                                  <Car className="w-4 h-4 text-emerald-600" />
                                  <span className="font-medium">Driving:</span>
                                  <span className="text-slate-800">
                                    {!a.DRIVE || String(a.DRIVE).toLowerCase().includes("nan") ? (
                                      <span style={{ color: "#b91c1c", fontWeight: 600 }}>N/A</span>
                                    ) : (
                                      a.DRIVE
                                    )}
                                  </span>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                  <Footprints className="w-4 h-4 text-orange-600" />
                                  <span className="font-medium">Walking:</span>
                                  <span className="text-slate-800">
                                    {!a.WALK || String(a.WALK).toLowerCase().includes("nan") ? (
                                      <span style={{ color: "#b91c1c", fontWeight: 600 }}>N/A</span>
                                    ) : (
                                      a.WALK
                                    )}
                                  </span>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                  <Bus className="w-4 h-4 text-indigo-600" />
                                  <span className="font-medium">Transit:</span>
                                  <span className="text-slate-800">
                                    {!a.TRANSIT || String(a.TRANSIT).toLowerCase().includes("nan") ? (
                                      <span style={{ color: "#b91c1c", fontWeight: 600 }}>N/A</span>
                                    ) : (
                                      a.TRANSIT
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-2">
                              <Button
                                onClick={on_event_click(a)}
                                asChild
                                className="w-full text-sm font-bold rounded-lg shadow-lg hover:shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-110 active:scale-105"
                              >
                                <a
                                  href="#"
                                  title="View on shared map"
                                  data-map-marker={a.name}
                                  className="no-underline"
                                  style={{ textDecoration: "none" }}
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    View on Map
                                  </span>
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                {/* Pagination dots for accommodations (page-based) */}
                {!isAccommodationsLoading && getFilteredAccommodations().length > 0 && (
                  <div className="flex justify-center gap-2 mt-3">
                    {Array.from({ length: getTotalPages(getFilteredAccommodations().length, accomScrollRef.current) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const container = accomScrollRef.current;
                            if (container) {
                              container.scrollTo({
                                left: index * CARD_WIDTH_PX,
                                behavior: 'smooth'
                              });
                            }
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === accomScrollIndex
                              ? 'bg-blue-600 w-6'
                              : 'bg-blue-300 hover:bg-blue-400'
                          }`}
                          aria-label={`Go to accommodation ${index + 1}`}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Events */}
            <div className="mt-10">
              <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent mb-3">
                Nearby Events & Activities
              </CardTitle>

              <div className="w-full">
                <div 
                  ref={eventsScrollRef}
                  onScroll={handleEventsScroll}
                  onMouseDown={onEventsMouseDown}
                  onMouseLeave={onEventsMouseLeave}
                  onMouseUp={onEventsMouseUp}
                  onMouseMove={onEventsMouseMove}
                  className="flex overflow-x-auto no-scrollbar gap-4 pb-3 snap-x snap-proximity border-2 border-slate-300 rounded-xl p-3 select-none cursor-grab active:cursor-grabbing bg-gradient-to-br from-slate-50 to-slate-100"
                >
                  {isEventsLoading ? (
                    <EventsSkeleton />
                  ) : events
                      .filter(
                        (ev) =>
                          parseFloat(ev.distance) <= (data.maxDistance ?? 20)
                      ).length === 0 ? (
                    <div className="w-full text-center py-12">
                      <span className="block text-sm italic text-slate-600">No events found.</span>
                      <span className="block text-sm italic text-slate-600 mt-1">Try adjusting the distance filter above.</span>
                    </div>
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
                            ${new_obj === ev ? 'bg-white border-4 border-black shadow shadow-black/50' : 'bg-white border border-blue-200 hover:shadow-md hover:-translate-y-1'}`}
                        >
                          <div className="w-full h-40 rounded-t-xl overflow-hidden bg-slate-100">
                            <img
                              src={ev.thumbnail}
                              alt={ev.title}
                              className="w-full h-40 object-cover"
                              onError={(e) => {
                                ((e.currentTarget as HTMLImageElement).src = ev.thumbnail);
                              }}
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-col justify-between flex-grow p-4">
                            <div>
                              <h4 className="font-semibold text-xl mb-1 text-blue-700">
                                {ev.title}
                              </h4>
                              <div className="text-sm mb-2 text-slate-700 inline-flex items-center gap-2">
                                <Route className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">{ev.distance} km</span>
                                <span className="text-slate-500">from campus</span>
                              </div>
                              <div className="text-sm mb-3 text-slate-700 inline-flex items-center gap-2 min-w-0">
                                <MapPin className="w-4 h-4 text-rose-500" />
                                <span className="whitespace-normal break-words">
                                  {ev.address[0]}
                                </span>
                              </div>
                              <div className="space-y-1.5 text-sm text-slate-700">
                                <div className="inline-flex items-center gap-2">
                                  <Car className="w-4 h-4 text-emerald-600" />
                                  <span className="font-medium">Driving:</span>
                                  <span className="text-slate-800">
                                    {!ev.DRIVE || String(ev.DRIVE).toLowerCase().includes("nan") ? (
                                      <span style={{ color: "#b91c1c", fontWeight: 600 }}>N/A</span>
                                    ) : (
                                      ev.DRIVE
                                    )}
                                  </span>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                  <Footprints className="w-4 h-4 text-orange-600" />
                                  <span className="font-medium">Walking:</span>
                                  <span className="text-slate-800">
                                    {!ev.WALK || String(ev.WALK).toLowerCase().includes("nan") ? (
                                      <span style={{ color: "#b91c1c", fontWeight: 600 }}>N/A</span>
                                    ) : (
                                      ev.WALK
                                    )}
                                  </span>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                  <Bus className="w-4 h-4 text-indigo-600" />
                                  <span className="font-medium">Transit:</span>
                                  <span className="text-slate-800">
                                    {!ev.TRANSIT || String(ev.TRANSIT).toLowerCase().includes("nan") ? (
                                      <span style={{ color: "#b91c1c", fontWeight: 600 }}>N/A</span>
                                    ) : (
                                      ev.TRANSIT
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-2">
                              <Button
                                onClick={on_event_click(ev)}
                                asChild
                                className="w-full text-sm font-bold rounded-lg shadow-lg hover:shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-110 active:scale-105"
                              >
                                <a
                                  href="#"
                                  title="View on shared map"
                                  data-map-marker={ev.title}
                                  className="no-underline"
                                  style={{ textDecoration: "none" }}
                                >
                                  <span className="inline-flex items-center gap-2 text-de">
                                    <MapPin className="w-4 h-4" />
                                    View on Map
                                  </span>
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                {/* Pagination dots for events (page-based) */}
                {!isEventsLoading && getFilteredEvents().length > 0 && (
                  <div className="flex justify-center gap-2 mt-3">
                    {Array.from({ length: getTotalPages(getFilteredEvents().length, eventsScrollRef.current) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const container = eventsScrollRef.current;
                            if (container) {
                              container.scrollTo({
                                left: index * CARD_WIDTH_PX,
                                behavior: 'smooth'
                              });
                            }
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === eventsScrollIndex
                              ? 'bg-blue-600 w-6'
                              : 'bg-blue-300 hover:bg-blue-400'
                          }`}
                          aria-label={`Go to event ${index + 1}`}
                        />
                      ))}
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
            className="rounded fixed bottom-8 right-8 z-50 h-14 w-14 flex items-center justify-center rounded-2xl shadow-2xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
            aria-label="Scroll to top"
          >
            <ArrowUpIcon className="w-5 h-5" style={{ color: "#ffffff"}} />
          </button>
        )}
      </div>
    </div>
  );
}
