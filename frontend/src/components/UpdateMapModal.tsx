
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
}

export function UpdateMapModal({ mapId, map }: ChildProps) {

    const [selectedCourses, setSelectedCourses] = useState<any>(map.map);
    const uid = sessionStorage.getItem('uid') || "";


    const updateMap = async () => {
        try {
          await axios.post(`http://localhost:3001/database/updateMap`, {
            mapId: mapId,
            uid: uid,
            map: selectedCourses
          });
        }
        catch (error) {
          console.log("API error:", error);
          toast("Error updating map", {
            description: "Please try again.",
          });
        }
      }
    return (

        <Dialog>
            <DialogTrigger asChild>
                <button className="btn btn-outline-primary btn-sm w-100">Update Map</button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[95vw] max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/20 [&_button[data-slot='dialog-close']]:text-white [&_button[data-slot='dialog-close']]:hover:bg-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white text-2xl">Update Map</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Make changes to your map here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="container mx-auto text-white my-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <GraduationCap className="w-6 h-6 text-white" />
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
                <UpdateExistingMap map={map} setSelectedCourses={setSelectedCourses} selectedCourses={selectedCourses} />
                <DialogFooter className='flex flex-row sticky bottom-0 z-10 bg-[#0a0a0a] py-3 w-50 mx-auto rounded-2xl gap-3 justify-center sm:justify-center'>
                    <DialogCancel className="bg-white/10 text-white hover:bg-white/20 border border-white/20">Cancel</DialogCancel>
                    <DialogAction className="bg-white text-black hover:bg-gray-200 font-semibold" onClick={() => {
                        updateMap();
                        toast.success("Map updated successfully", {
                            description: "The map has been updated.",
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }}>Update Map</DialogAction>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

