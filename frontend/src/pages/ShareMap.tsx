import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MapPin, GraduationCap, BookOpen, Save, AlertCircle } from "lucide-react";


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
                const response = await axios.get(`http://localhost:3001/database/getSavedMaps/${uid}`);
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
            await axios.post(`http://localhost:3001/database/saveMap`, {
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




    return (
        <div
            className="relative min-h-screen w-full text-white overflow-hidden"
            style={{
                backgroundColor: "#0a0a0a",
                backgroundImage:
                    "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.06) 0%, transparent 25%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.04) 0%, transparent 30%)",
            }}
        >
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            <div className="relative z-10 container mx-auto px-4 py-10">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-2">Shared Course Map</h1>
                    <p className="text-gray-400 text-sm">
                        Review and save this course mapping to your profile
                    </p>
                </div>

                {/* Map Information Card */}
                <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-2xl font-semibold">Mapped For</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">

                                <p className="text-gray-300 font-semibold text-sm uppercase tracking-wide">Country</p>
                            </div>
                            <p className="text-white text-lg font-medium pl-6">{map.country}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
  
                                <p className="text-gray-300 font-semibold text-sm uppercase tracking-wide">University</p>
                            </div>
                            <p className="text-white text-lg font-medium pl-6">{map.university}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">

                                <p className="text-gray-300 font-semibold text-sm uppercase tracking-wide">Faculty</p>
                            </div>
                            <p className="text-white text-lg font-medium pl-6">{map.faculty}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">

                                <p className="text-gray-300 font-semibold text-sm uppercase tracking-wide">Major</p>
                            </div>
                            <p className="text-white text-lg font-medium pl-6">{map.major}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">

                                <p className="text-gray-300 font-semibold text-sm uppercase tracking-wide">Track</p>
                            </div>
                            <p className="text-white text-lg font-medium pl-6">{map.track ? map.track : <span className="text-gray-500">None</span>}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">

                                <p className="text-gray-300 font-semibold text-sm uppercase tracking-wide">Second Major</p>
                            </div>
                            <p className="text-white text-lg font-medium pl-6">{map.secondMajor ? map.secondMajor : <span className="text-gray-500">None</span>}</p>
                        </div>
                    </div>
                </div>

                {/* Mapped Courses Card */}
                <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpen className="w-6 h-6 text-white" />
                        <h2 className="text-2xl font-semibold">Mapped Courses</h2>
                    </div>

                    {Object.keys(map.map).length === 0 || Object.keys(map.map).every((area) => map.map[area].courses.length === 0) ? (
                        <div className="text-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <BookOpen className="w-12 h-12 text-gray-600" />
                                <p className="text-gray-500 italic text-lg">No courses mapped</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.keys(map.map).map((area) => (
                                map.map[area].courses.length > 0 && (
                                    <div key={area} className="bg-white/5 rounded-xl p-5 border border-white/10">
                                        <h3 className="font-semibold text-white text-lg mb-4 pb-2 border-b border-white/10">
                                            {area}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {map.map[area].courses.map((course: string) => (
                                                <span
                                                    key={course}
                                                    className="px-3 py-1.5 bg-white/10 text-gray-200 rounded-lg text-sm border border-white/10 hover:bg-white/15 transition-colors"
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
                    <button
                        disabled={!uid || uid === "" || saveMapDisabled}
                        onClick={saveMap}
                        className={`inline-flex items-center gap-2 bg-white text-black font-semibold hover:bg-gray-200 hover:scale-105 transition-transform px-8 py-3 text-lg rounded-full shadow-lg ${(!uid || uid === "" || saveMapDisabled)
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                            }`}
                    >
                        <Save className="w-5 h-5" />
                        Save Map
                    </button>

                    {(!uid || uid === "") && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-amber-400">
                            <AlertCircle/> 
                            <p className="text-lg"> Please login to save this map to your profile</p>
                        </div>
                    )}

                    {saveMapDisabled && uid && uid !== "" && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-amber-400">
                            <AlertCircle/> 
                            <p className="text-lg"> You have reached the maximum number of maps allowed. Delete your existing maps to save more.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}