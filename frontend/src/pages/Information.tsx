import axios from "axios";
import SchoolCard from "../components/SchoolCard";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import CardSkeleton from "@/components/SchoolCardSkeleton";
import { useNavigate } from "react-router-dom";
import { ArrowUpIcon, Search, Globe, BookOpen, SearchX, FileX, School } from "lucide-react";

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

function scrollToTop() {
  const topElement = document.getElementById("top");
  if (topElement) {
    topElement.scrollIntoView({ behavior: "auto" }); // instant scroll
  }
}

function Information() {
  // Scroll constant
  const [showScrollButton, setShowScrollButton] = useState(false);
  const navigate = useNavigate();
  const [schools, setSchools] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [country, setCountry] = useState<string>("");

  const [courseAreas, setCourseAreas] = useState<string[]>([]);
  const [courseArea, setCourseArea] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getAllSchools = async () => {
    const response = await axios.get(
      "https://smuxchange-backend.vercel.app/database/getAllExchangeSchools"
    );
    const schools = response.data;
    const uniqueCountries = [
      ...new Set(schools.map((school: any) => school.country)),
    ] as string[];
    setCountries(uniqueCountries.sort());
    setSchools(
      schools.sort(
        (a: any, b: any) =>
          b["mappable_basket"].length - a["mappable_basket"].length
      )
    );
    setIsLoading(false);
  };

  const getSchoolsByCountry = async (country: string) => {
    const response = await axios.get(
      `https://smuxchange-backend.vercel.app/database/getAllExchangeSchoolsByCountry/${country}`
    );
    setSchools(
      response.data.sort(
        (a: any, b: any) =>
          b["mappable_basket"].length - a["mappable_basket"].length
      )
    );
    setIsLoading(false);
  };

  const getAllCourseAreas = async () => {
    const response = await axios.get(
      "https://smuxchange-backend.vercel.app/database/getAllCourseAreas"
    );
    const courseAreas = response.data;
    setCourseAreas(Object.keys(courseAreas[0]));
  };

  const getSchoolsByCourseArea = async (courseArea: string) => {
    const response = await axios.get(
      `https://smuxchange-backend.vercel.app/database/getAllExchangeSchools/`
    );
    const schools = response.data;
    const schoolsByCourseArea = schools.filter((school: any) =>
      school["mappable_basket"].includes(courseArea)
    );
    setSchools(
      schoolsByCourseArea.sort(
        (a: any, b: any) =>
          b["mappable_basket"].length - a["mappable_basket"].length
      )
    );
    setIsLoading(false);
  };

  const getSchoolsByCourseAreaAndCountry = async (
    courseArea: string,
    country: string
  ) => {
    const response = await axios.get(
      `https://smuxchange-backend.vercel.app/database/getAllExchangeSchoolsByCountry/${country}`
    );
    const schools = response.data;
    const schoolsByCourseArea = schools.filter((school: any) =>
      school["mappable_basket"].includes(courseArea)
    );
    setSchools(
      schoolsByCourseArea.sort(
        (a: any, b: any) =>
          b["mappable_basket"].length - a["mappable_basket"].length
      )
    );
    setIsLoading(false);
  };

  useEffect(() => {
    getAllCourseAreas();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
    setIsLoading(true);
    if (courseArea !== "" && country !== "") {
      getSchoolsByCourseAreaAndCountry(courseArea, country);
    } else if (courseArea !== "") {
      getSchoolsByCourseArea(courseArea);
    } else if (country !== "") {
      getSchoolsByCountry(country);
    } else {
      getAllSchools();
    }
  }, [country, courseArea]);

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

  // Pagination calculations
  let startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [currentSchools, setCurrentSchools] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);



  useEffect(() => {
    if (
      sessionStorage.getItem("uid") &&
      !(sessionStorage.getItem("name") || "").trim()
    ) {
      navigate("/profile");
    }
  }, []);

  const [search, setSearch] = useState<string>("");
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  useEffect(() => {
    if (filteredSchools.length > 0) {
      setCurrentSchools(filteredSchools.slice(startIndex, endIndex));
    } else {
      if (search !== "") {
        setCurrentSchools([]);
      } else {
        setCurrentSchools(schools.slice(startIndex, endIndex));
      }
    }
  }, [schools, filteredSchools, startIndex, endIndex]);

  useEffect(() => {
    if (search !== "") {
      setFilteredSchools(schools.filter((school: any) => school.host_university.toLowerCase().includes(search.toLowerCase())));
      setCurrentPage(1);
    } else {
      setFilteredSchools([]);
      setCurrentPage(1);
    }
  }, [search]);

  useEffect(() => {
    if (filteredSchools.length > 0) {
      setTotalPages(Math.ceil(filteredSchools.length / itemsPerPage));
    } else {
      setTotalPages(Math.ceil(schools.length / itemsPerPage));
    }
  }, [schools, filteredSchools]);

  return (
    <div id="top">
      <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
        {/* === Subtle gradient + grid overlay === */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,43,114,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 container mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <span className="inline-block ml-2 animate-gif-pulse"><img src="/images/school.gif" alt="Schools" className="w-35 h-35 border-2 border-blue-300 rounded-lg shadow-lg" /></span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-none bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: 'inherit' }}>
              <TypingAnimation text="Search for Schools" speed={100} />
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-3xl mx-auto">
              Explore different universities and exchange destinations with ease.
            </p>
          </div>

          {/* Search Filters */}
          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg py-8 px-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Country */}
              <div>
                <p className="mb-1 fw-bold" style={{ color: "#102b72" }}>
                  <Globe className="w-4 h-4 text-blue-600 d-inline align-middle" /> Select Country</p>
                <select
                  className="form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
                  style={{ color: "#102b72" }}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option selected value="">
                    All countries
                  </option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Course Area */}
              <div>
                <p className="mb-1 fw-bold" style={{ color: "#102b72" }}>
                  <BookOpen className="w-4 h-4 text-blue-600 d-inline align-middle" /> Select Course Area</p>
                <select
                  className="form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
                  style={{ color: "#102b72" }}
                  onChange={(e) => setCourseArea(e.target.value)}
                >
                  <option selected value="">
                    All course areas
                  </option>
                  {courseAreas.map((courseArea) => (
                    <option key={courseArea} value={courseArea}>
                      {courseArea}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2 w-full max-w-xl relative md:col-span-2 mx-auto">
                <p className="mb-1 fw-bold" style={{ color: "#102b72" }}>
                  <Search className="w-4 h-4 text-blue-600 d-inline align-middle" /> Search by University Name</p>
                <input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Search by university name"
                  className="w-full rounded-md border border-[#102b72]/30 bg-white pl-3 pr-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#102b72] transition"
                  style={{ color: "#102b72" }}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* School Results */}
          <div className="container mx-auto mt-5 text-center">
            <div className="row justify-content-center">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))
              ) : (
                currentSchools.map((school: any) => (
                  <SchoolCard key={school["host_university"]} school={school} />
                ))
              )}
            </div>
          </div>

          {/* No Results */}
          {currentSchools.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center mt-12 mb-12">
               <div className="text-center border border-blue-200 border-dashed rounded-xl bg-white/90 backdrop-blur-sm p-14 w-full max-w-[620px] group transition duration-500 hover:duration-200">
                <div className="flex justify-center isolate">
                  {/* First stacked icon card */}
                  <div className="size-12 bg-white grid place-items-center ring-1 ring-black/[0.08] rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow shadow-lg group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                    <SearchX className="w-5 h-5 text-slate-600" />
                  </div>
                  {/* Second stacked icon card (center) */}
                  <div className="size-12 bg-white grid place-items-center ring-1 ring-black/[0.08] rounded-xl z-10 shadow-lg group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                    <School className="w-5 h-5 text-slate-600" />
                  </div>
                  {/* Third stacked icon card */}
                  <div className="size-12 bg-white grid place-items-center ring-1 ring-black/[0.08] rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                    <FileX className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
                <h2 className="text-base text-slate-800 font-medium mt-6">No Schools Found</h2>
                <p className="text-sm text-slate-600 mt-1">Try adjusting your search filters or browse<br />all available schools.</p>
              </div>
            </div>
          ) : null}

          {/* Pagination */}
          {currentSchools.length > 0 && totalPages > 1 && (
            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          scrollToTop();
                        }
                      }}
                      className="hover:bg-blue-100"
                      style={{
                        pointerEvents: currentPage === 1 ? 'none' : 'auto',
                        opacity: currentPage === 1 ? 0.5 : 1,
                        color: '#2563eb',
                        textDecoration: 'none',
                      }}
                    />
                  </PaginationItem>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          isActive={pageNum === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                            scrollToTop();

                          }}
                          className={`hover:bg-blue-100 ${pageNum === currentPage ? 'bg-blue-600 text-white' : ''}`}
                          style={{
                            color: pageNum === currentPage ? 'white' : '#2563eb',
                            textDecoration: 'none',
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis 
                        className="text-blue-600"
                        style={{ color: '#2563eb' }}
                      />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                     <PaginationNext
                       href="#"
                       onClick={(e) => {
                         e.preventDefault();
                         if (currentPage < totalPages) {
                           setCurrentPage(currentPage + 1);
                           scrollToTop();
                         }
                       }}
                       className="hover:bg-blue-100"
                       style={{
                         pointerEvents: currentPage === totalPages ? 'none' : 'auto',
                         opacity: currentPage === totalPages ? 0.5 : 1,
                         color: '#2563eb',
                         textDecoration: 'none',
                       }}
                     />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
        {/* Scroll to top */}
        {showScrollButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded fixed bottom-8 right-8 z-50 h-14 w-14 flex items-center justify-center rounded-2xl shadow-2xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
            aria-label="Scroll to top"
          >
            <ArrowUpIcon className="w-5 h-5" style={{ color: "#ffffff" }} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Information;


