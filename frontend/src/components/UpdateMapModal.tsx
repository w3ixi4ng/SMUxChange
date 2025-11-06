import {
    Dialog,
    DialogAction,
    DialogCancel,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UpdateExistingMap from "./UpdateExistingMap";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { GraduationCap, Edit, Globe, BookOpen, Map, School } from "lucide-react";

type ChildProps = {
    map: any
    mapId: string
    setSavedMaps: (maps: any) => void
}

export function UpdateMapModal({ mapId, map, setSavedMaps}: ChildProps) {

    const [selectedCourses, setSelectedCourses] = useState<any>(map.map);
    const uid = sessionStorage.getItem('uid') || "";


    const updateMap = async () => {
        try {
            await axios.post(`https://smuxchange-backend.vercel.app/database/updateMap`, {
                mapId: mapId,
                uid: uid,
                map: selectedCourses
            });
        }
        catch (error) {
            console.log("API error:", error);
            toast.error("Error updating map", {
                description: "Please try again.",
            });
        }
    }


    return (

        <Dialog>
            <DialogTrigger asChild>
                <button className="btn btn-sm w-100 font-semibold transition-transform hover:scale-105 d-flex align-items-center justify-content-center whitespace-nowrap" style={{ backgroundColor: "#102b72", color: "#ffffff", border: "none" }}>
                    <Edit className="w-4 h-4 me-2 flex-shrink-0" />
                    <span className="truncate">Update Map</span>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[95vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 border-blue-200 [&_button[data-slot='dialog-close']]:text-blue-600 [&_button[data-slot='dialog-close']]:hover:bg-blue-100 [&_button[data-slot='dialog-close']]:hover:text-blue-700 pb-0">
                <DialogHeader>
                    <DialogTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">Update Map</DialogTitle>
                    <DialogDescription className="text-slate-600 text-base">
                        Make changes to your map here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="container mx-auto my-6 bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">Mapped For</h2>
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
                            <p className="text-lg font-medium pl-6 text-slate-700" style={{ opacity: map.track ? 1 : 0.5 }}>{map.track ? map.track : "None"}</p>
                        </div>

                        <div className="space-y-1 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <p className="font-semibold text-sm uppercase tracking-wide text-slate-600 mb-2">
                                <GraduationCap className="w-4 h-4 d-inline align-middle me-2" />
                                Second Major
                            </p>
                            <p className="text-lg font-medium pl-6 text-slate-700" style={{ opacity: map.secondMajor ? 1 : 0.5 }}>{map.secondMajor ? map.secondMajor : "None"}</p>
                        </div>
                    </div>
                </div>
                <UpdateExistingMap map={map} setSelectedCourses={setSelectedCourses} selectedCourses={selectedCourses} />
                <DialogFooter className='flex flex-row sticky bottom-0 z-10 bg-transparent py-3 w-100 mx-auto gap-3 justify-center sm:justify-center'>
                    <DialogCancel className="bg-white border-2 border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">Cancel</DialogCancel>
                    <DialogAction className="font-semibold bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => {
                        updateMap();
                        toast.success("Map updated successfully", {
                            description: "The map has been updated.",
                        });
                        setSavedMaps((prev: any[]) => prev.map((m: any) => m.id === mapId ? { ...m, map: selectedCourses } : m));
                    }}>Update Map</DialogAction>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

