
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
                    <DialogTitle className="text-white">Update Map</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Make changes to your map here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="container mx-auto text-white my-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-lg mb-0">
                    <h4 className="text-white mb-1 font-bold">Mapped For</h4>
                    <div className="row">
                        <div className="col-lg-6 ">
                            <p className="text-white mb-1 font-bold">Country</p>
                            <p className="text-gray-400 mb-1">{map.country}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-white mb-1 font-bold">University</p>
                            <p className="text-gray-400 mb-1">{map.university}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-white mb-1 font-bold">Faculty</p>
                            <p className="text-gray-400 mb-1">{map.faculty}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-white mb-1 font-bold">Major</p>
                            <p className="text-gray-400 mb-1">{map.major}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-white mb-1 font-bold">Track</p>
                            <p className="text-gray-400 mb-1">{map.track ? map.track : "None"}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-white mb-1 font-bold">Second Major</p>
                            <p className="text-gray-400 mb-1">{map.secondMajor ? map.secondMajor : "None"}</p>
                        </div>
                    </div>
                </div>
                <UpdateExistingMap map={map} setSelectedCourses={setSelectedCourses} selectedCourses={selectedCourses} />
                <DialogFooter className='d-flex justify-content-center sticky bottom-0 z-10 bg-[#0a0a0a] py-3 w-50 mx-auto rounded-2xl'>
                    <DialogCancel className="">Cancel</DialogCancel>
                    <DialogAction className="hover:bg-gray-500" onClick={() => {
                        updateMap();
                        toast("Map updated successfully", {
                            description: "The map has been updated.",
                        });
                        window.location.reload();
                    }}>Update Map</DialogAction>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

