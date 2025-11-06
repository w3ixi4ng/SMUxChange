import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { BookOpen, Save, AlertCircle, Globe, GraduationCap, Map, School } from "lucide-react";

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


export function ShareMap() {
    const uid = sessionStorage.getItem('uid');
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const encodedMap = urlParams.get('map');
    const map = JSON.parse(decodeURIComponent(encodedMap || ""));



    useEffect(() => {
        if (!uid) {
            toast.info('Please login to save and edit this map in your profile');
            sessionStorage.setItem('backToUrl', window.location.href);
        }
        else {
            sessionStorage.removeItem('backToUrl');
        }
    }, [uid]);


    const [saveMapDisabled, setSaveMapDisabled] = useState(false);

    useEffect(() => {
        const getSavedMaps = async () => {
            if (!uid || uid === "") {
                setSaveMapDisabled(false);
                return;
            }
            try {
                const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getSavedMaps/${uid}`);
                if (response.data && response.data.length >= 3) {
                    setSaveMapDisabled(true);
                } else {
                    setSaveMapDisabled(false);
                }
            }
            catch (error) {
                console.log("API error:", error);
                setSaveMapDisabled(false);
            }
        };

        getSavedMaps();
    }, [uid]);

    const saveMap = async () => {
        if (saveMapDisabled) {
            toast.error("You have reached the maximum number of maps allowed");
            return;
        }
        try {
            await axios.post(`https://smuxchange-backend.vercel.app/database/saveMap`, {
                uid: uid,
                country: map.country,
                university: map.university,
                faculty: map.faculty,
                major: map.major,
                track: map.track,
                secondMajor: map.secondMajor,
                map: map.map
            });
            toast.success("Map saved successfully", {
                description: "The map has been saved to your profile.",
            });
            navigate("/profile");
        }
        catch (error) {
            console.error("API error:", error);
            toast.error("Error saving map", {
                description: "Please try again.",
            });
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



    return (
        <div className="overflow-hidden relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
            {/* === Subtle gradient + grid overlay === */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,43,114,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="relative z-10 container mx-auto px-4 py-10">
                {/* Page Header - More Welcoming */}
                <div className="text-center mb-12">
                    <span className="inline-block ml-2 animate-gif-pulse">
                        <img src="/images/share.gif" alt="Share" className="w-35 h-35 border-2 border-blue-300 rounded-lg shadow-lg" />
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-none" style={{ fontFamily: 'inherit' }}>
                        <TypingAnimation text="Shared Course Map" speed={100} />
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-3xl mx-auto" style={{ fontFamily: 'inherit' }}>
                        Review and save this course mapping to your profile
                    </p>
                </div>

                {/* Map Information Card */}
                <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-8">
                    <div className="flex items-center justify-center gap-2 mb-6 text-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                            Mapped For
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <p className="font-semibold text-sm uppercase tracking-wide text-slate-600 mb-2">
                                <Globe className="w-4 h-4 d-inline align-middle me-2" />
                                Country
                            </p>
                            <p className="text-lg font-medium pl-6 text-slate-700">{map.country}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <p className="font-semibold text-sm uppercase tracking-wide text-slate-600 mb-2">
                                <School className="w-4 h-4 d-inline align-middle me-2" />
                                University
                            </p>
                            <p className="text-lg font-medium pl-6 text-slate-700">{map.university}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <p className="font-semibold text-sm uppercase tracking-wide text-slate-600 mb-2">
                                <BookOpen className="w-4 h-4 d-inline align-middle me-2" />
                                Faculty
                            </p>
                            <p className="text-lg font-medium pl-6 text-slate-700">{map.faculty}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <p className="font-semibold text-sm uppercase tracking-wide text-slate-600 mb-2">
                                <GraduationCap className="w-4 h-4 d-inline align-middle me-2" />
                                Major
                            </p>
                            <p className="text-lg font-medium pl-6 text-slate-700">{map.major}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <p className="font-semibold text-sm uppercase tracking-wide text-slate-600 mb-2">
                                <Map className="w-4 h-4 d-inline align-middle me-2" />
                                Track
                            </p>
                            <p className="text-lg font-medium pl-6 text-slate-700">{map.track ? map.track : <span className="text-slate-400">None</span>}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <p className="font-semibold text-sm uppercase tracking-wide text-slate-600 mb-2">
                                <GraduationCap className="w-4 h-4 d-inline align-middle me-2" />
                                Second Major
                            </p>
                            <p className="text-lg font-medium pl-6 text-slate-700">{map.secondMajor ? map.secondMajor : <span className="text-slate-400">None</span>}</p>
                        </div>
                    </div>
                </div>

                {/* Mapped Courses Card */}
                <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-8">
                    <div className="flex items-center justify-center gap-2 mb-6 text-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                            Mapped Courses
                        </h2>
                    </div>

                    {Object.keys(map.map).length === 0 || Object.keys(map.map).every((area) => map.map[area].courses.length === 0) ? (
                        <div className="text-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <BookOpen className="w-12 h-12 text-slate-400" />
                                <p className="italic text-lg text-slate-600">No courses mapped</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.keys(map.map).map((area) => (
                                map.map[area].courses.length > 0 && (
                                    <div key={area} className="space-y-2 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 h-full">
                                        <p className="font-semibold text-sm uppercase tracking-wide text-slate-600 mb-2">
                                            {area}
                                        </p>
                                        <div className="flex flex-wrap gap-2 pl-1">
                                            {map.map[area].courses.map((course: string) => (
                                                <span
                                                    key={course}
                                                    className="px-3 py-1.5 rounded-lg text-sm border border-indigo-200 hover:bg-blue-100 hover:border-indigo-300 transition-colors text-slate-700 bg-white"
                                                >
                                                    {course}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>

                {/* Save Button Section */}
                <div className="max-w-5xl mx-auto text-center">
                    {uid && uid !== "" ? (
                        <button
                            disabled={saveMapDisabled}
                            onClick={saveMap}
                            className={`group relative overflow-hidden font-bold px-8 py-2 text-lg rounded shadow-2xl transition-all duration-300 ${
                                saveMapDisabled
                                    ? "opacity-50 cursor-not-allowed bg-gray-400"
                                    : "bg-blue-600 text-white hover:shadow-blue-500/50 hover:bg-blue-700 animate-jump-hover"
                            }`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Save className="w-5 h-5" />
                                Save Map
                            </span>
                            {!saveMapDisabled && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            )}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <button
                                disabled
                                className="opacity-50 cursor-not-allowed group relative overflow-hidden font-bold px-8 py-2 text-lg rounded shadow-2xl transition-all duration-300 bg-blue-600 text-white"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Save className="w-5 h-5" />
                                    Save Map
                                </span>
                            </button>
                            <p className="italic text-center text-slate-600">
                                <Link
                                    to="/login"
                                    className="underline font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Login
                                </Link>{" "}
                                to save map.
                            </p>
                        </div>
                    )}

                    {saveMapDisabled && uid && uid !== "" && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-amber-700 bg-amber-100 border border-amber-300 rounded-lg p-3 max-w-md mx-auto">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm">You have reached the maximum number of maps allowed. Delete your existing maps to save more.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
