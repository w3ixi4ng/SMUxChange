import axios from "axios";
import SchoolCard from "../components/SchoolCard";
import { useEffect, useState } from "react";

function scrollToTop() {
  const topElement = document.getElementById("top");
  if (topElement) {
    topElement.scrollIntoView({ behavior: "auto" }); // instant scroll
  }
}

function Information() {
  // Scroll constant
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [schools, setSchools] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [country, setCountry] = useState<string>("");

  const [courseAreas, setCourseAreas] = useState<string[]>([]);
  const [courseArea, setCourseArea] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAllSchools = async () => {
    const response = await axios.get(
      "http://localhost:3001/database/getAllExchangeSchools"
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
      `http://localhost:3001/database/getAllExchangeSchoolsByCountry/${country}`
    );
    setSchools(
      response.data.sort(
        (a: any, b: any) =>
          b["mappable_basket"].length - a["mappable_basket"].length
      )
    );
  };

  const getAllCourseAreas = async () => {
    const response = await axios.get(
      "http://localhost:3001/database/getAllCourseAreas"
    );
    const courseAreas = response.data;
    setCourseAreas(Object.keys(courseAreas[0]));
  };

  const getSchoolsByCourseArea = async (courseArea: string) => {
    const response = await axios.get(
      `http://localhost:3001/database/getAllExchangeSchools/`
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
  };

  const getSchoolsByCourseAreaAndCountry = async (
    courseArea: string,
    country: string
  ) => {
    const response = await axios.get(
      `http://localhost:3001/database/getAllExchangeSchoolsByCountry/${country}`
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
  };

  useEffect(() => {
    getAllSchools();
    getAllCourseAreas();
  }, []);
  
  useEffect(() => {
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
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // 🖤 Full-page radial background (visible under all content)
    <div id="top">
    <div
      className="relative min-h-screen w-full text-white 
      bg-[#0a0a0a] 
      bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.06)_0%,transparent_25%),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.04)_0%,transparent_30%)]"
    >
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* All content sits above overlay */}
      <div className="relative z-10 container mx-auto px-4 py-10">
        {/* 🏫 Centered Header (matching Mappable Search) */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Schools</h1>
          <p className="text-gray-400 text-sm">
            Explore different universities and exchange destinations with ease.
          </p>
        </div>

        {/* Search Filters */}
        <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg py-8 px-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Country */}
            <div>
              <label className="text-gray-200 mb-1 font-bold">
                Select Country
              </label>
              <select
                className="w-full rounded-md border border-white/30 bg-white/90 text-black px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
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
              <label className="text-gray-200 mb-1 font-bold">
                Select Course Area
              </label>
              <select
                className="w-full rounded-md border border-white/30 bg-white/90 text-black px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
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
          </div>
        </div>

        {/* School Results */}
        <div className="container mx-auto mt-5 text-center">
          <div className="row justify-content-center">
            {schools.map((school: any) => (
              <SchoolCard key={school["host_university"]} school={school} />
            ))}
          </div>
        </div>

        {/* No Results */}
        {schools.length === 0 && !isLoading && (
          <div className="container mx-auto mt-5 mb-1 text-center">
            <div className="bg-red-500/20 text-red-300 border border-red-500/30 px-6 py-4 rounded-lg inline-block">
              Module Unavailable. Try a different Course Area or Country.
            </div>
          </div>
        )}
      </div>
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

export default Information;

