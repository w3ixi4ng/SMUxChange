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
import { GraduationCap } from "lucide-react";

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
                <button className="btn btn-sm w-100 font-semibold transition-transform hover:scale-105" style={{ backgroundColor: "#102b72", color: "#ffffff", border: "none" }}>Update Map</button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[95vw] max-h-[90vh] overflow-y-auto bg-[#eeeeee] border-[#102b72]/20 [&_button[data-slot='dialog-close']]:text-[#102b72] [&_button[data-slot='dialog-close']]:hover:bg-[#102b72]/10">
                <DialogHeader>
                    <DialogTitle className="text-2xl" style={{ color: "#102b72" }}>Update Map</DialogTitle>
                    <DialogDescription style={{ color: "#102b72", opacity: 0.7 }}>
                        Make changes to your map here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="container mx-auto my-10 bg-white/80 backdrop-blur-md border border-[#102b72]/20 rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <GraduationCap className="w-6 h-6" style={{ color: "#102b72" }} />
                        <h2 className="text-2xl font-semibold" style={{ color: "#102b72" }}>Mapped For</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#102b72", opacity: 0.7 }}>Country</p>
                            </div>
                            <p className="text-lg font-medium pl-6" style={{ color: "#102b72" }}>{map.country}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#102b72", opacity: 0.7 }}>University</p>
                            </div>
                            <p className="text-lg font-medium pl-6" style={{ color: "#102b72" }}>{map.university}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#102b72", opacity: 0.7 }}>Faculty</p>
                            </div>
                            <p className="text-lg font-medium pl-6" style={{ color: "#102b72" }}>{map.faculty}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#102b72", opacity: 0.7 }}>Major</p>
                            </div>
                            <p className="text-lg font-medium pl-6" style={{ color: "#102b72" }}>{map.major}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#102b72", opacity: 0.7 }}>Track</p>
                            </div>
                            <p className="text-lg font-medium pl-6" style={{ color: "#102b72", opacity: map.track ? 1 : 0.5 }}>{map.track ? map.track : "None"}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#102b72", opacity: 0.7 }}>Second Major</p>
                            </div>
                            <p className="text-lg font-medium pl-6" style={{ color: "#102b72", opacity: map.secondMajor ? 1 : 0.5 }}>{map.secondMajor ? map.secondMajor : "None"}</p>
                        </div>
                    </div>
                </div>
                <UpdateExistingMap map={map} setSelectedCourses={setSelectedCourses} selectedCourses={selectedCourses} />
                <DialogFooter className='flex flex-row sticky bottom-0 z-10 bg-[#eeeeee] py-3 w-100 mx-auto rounded-2xl gap-3 justify-center sm:justify-center'>
                    <DialogCancel className="bg-white border border-[#102b72]/30 hover:bg-[#102b72]/10" style={{ color: "#102b72" }}>Cancel</DialogCancel>
                    <DialogAction className="font-semibold" style={{ backgroundColor: "#102b72", color: "#ffffff" }} onClick={() => {
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

