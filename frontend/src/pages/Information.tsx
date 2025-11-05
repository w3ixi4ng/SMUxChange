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
import { ArrowUpIcon, Search } from "lucide-react";

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
      setCurrentSchools(schools.slice(startIndex, endIndex));
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
      <div
        className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

        <div className="relative z-10 container mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <span className="inline-block ml-2"><img src="/images/school.gif" alt="Schools" className="w-35 h-35 border-2 border-[#102b72]/30 rounded-lg" /></span>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#102b72" }}>Schools</h1>
            <p className="text-sm" style={{ color: "#102b72" }}>
              Explore different universities and exchange destinations with ease.
            </p>
          </div>

          {/* Search Filters */}
          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-[#102b72]/20 rounded-2xl shadow-lg py-8 px-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Country */}
              <div>
                <label className="mb-1 font-bold" style={{ color: "#102b72" }}>
                  Select Country
                </label>
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
                <label className="mb-1 font-bold" style={{ color: "#102b72" }}>
                  Select Course Area
                </label>
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
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#102b72" }} />
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search by university name"
                className="w-full rounded-md border border-[#102b72]/30 bg-white pl-10 pr-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#102b72] transition"
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
            <div className="container mx-auto mt-5 mb-1 text-center">
              <div className="bg-red-100 text-red-700 border border-red-300 px-6 py-4 rounded-lg inline-block">
                No Schools Found.
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
                      className="hover:bg-[#102b72]/10"
                      style={{
                        pointerEvents: currentPage === 1 ? 'none' : 'auto',
                        opacity: currentPage === 1 ? 0.5 : 1,
                        color: '#102b72',
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
                          className={`hover:bg-[#102b72]/10 ${pageNum === currentPage ? 'bg-[#102b72] text-white' : ''}`}
                          style={{
                            color: pageNum === currentPage ? 'white' : '#102b72',
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
                      <PaginationEllipsis />
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
                      className="hover:bg-[#102b72]/10"
                      style={{
                        pointerEvents: currentPage === totalPages ? 'none' : 'auto',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        color: '#102b72',
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
            className="rounded fixed bottom-8 right-8 z-50 h-14 w-14 flex items-center justify-center rounded-2xl shadow-2xl bg-gradient-to-br from-green-200 to-blue-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
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


