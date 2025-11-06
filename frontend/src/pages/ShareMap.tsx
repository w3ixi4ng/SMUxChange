import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { BookOpen, Save, AlertCircle, Globe, GraduationCap, MapPin } from "lucide-react";


export function ShareMap() {
    const uid = sessionStorage.getItem('uid');
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const encodedMap = urlParams.get('map');
    const map = JSON.parse(decodeURIComponent(encodedMap || ""));



    useEffect(() => {
        if (!uid) {
            toast.error('Please login to save and edit this map in your profile');
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
        if (!uid || uid === "") {
            toast.error("Please login to save this map");
            return;
        }
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
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-none bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                        Shared Course Map
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-3xl mx-auto">
                        Review and save this course mapping to your profile
                    </p>
                </div>

                {/* Map Information Card */}
                <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                            Mapped For
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-blue-600" />
                                <p className="font-semibold text-sm uppercase tracking-wide text-slate-600">Country</p>
                            </div>
                            <p className="text-lg font-medium pl-6 text-slate-800">{map.country}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <GraduationCap className="w-4 h-4 text-blue-600" />
                                <p className="font-semibold text-sm uppercase tracking-wide text-slate-600">University</p>
                            </div>
                            <p className="text-lg font-medium pl-6 text-slate-800">{map.university}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <p className="font-semibold text-sm uppercase tracking-wide text-slate-600">Faculty</p>
                            </div>
                            <p className="text-lg font-medium pl-6 text-slate-800">{map.faculty}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <p className="font-semibold text-sm uppercase tracking-wide text-slate-600">Major</p>
                            </div>
                            <p className="text-lg font-medium pl-6 text-slate-800">{map.major}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <p className="font-semibold text-sm uppercase tracking-wide text-slate-600">Track</p>
                            </div>
                            <p className="text-lg font-medium pl-6 text-slate-800">{map.track ? map.track : <span className="text-slate-400">None</span>}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <p className="font-semibold text-sm uppercase tracking-wide text-slate-600">Second Major</p>
                            </div>
                            <p className="text-lg font-medium pl-6 text-slate-800">{map.secondMajor ? map.secondMajor : <span className="text-slate-400">None</span>}</p>
                        </div>
                    </div>
                </div>

                {/* Mapped Courses Card */}
                <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-8">
                    <div className="flex items-center gap-2 mb-6">
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
                        <div className="space-y-6">
                            {Object.keys(map.map).map((area) => (
                                map.map[area].courses.length > 0 && (
                                    <div key={area} className="bg-white rounded-xl p-5 border border-blue-200 hover:shadow-md transition-all duration-200">
                                        <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-blue-200 text-slate-800">
                                            {area}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {map.map[area].courses.map((course: string) => (
                                                <span
                                                    key={course}
                                                    className="px-3 py-1.5 bg-white rounded-lg text-sm border border-indigo-200 hover:bg-indigo-50 transition-colors text-slate-700"
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
                            className={`group relative overflow-hidden font-bold px-8 py-3 text-lg rounded-2xl shadow-2xl transition-all duration-300 ${
                                saveMapDisabled
                                    ? "opacity-50 cursor-not-allowed bg-gray-400 text-white"
                                    : "bg-gradient-to-br from-blue-600 to-emerald-600 text-white hover:shadow-blue-500/50 hover:scale-105"
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
                                className="opacity-50 cursor-not-allowed group relative overflow-hidden font-bold px-8 py-3 text-lg rounded-2xl shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-600 to-emerald-600 text-white"
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
