import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios";  
import { toast } from "sonner";

export function DeleteMapAlert({ uid, mapId, setSavedMaps, savedMaps }: { uid: string, mapId: string, setSavedMaps: (maps: any) => void, savedMaps: any }) {
    const deleteMap = async (mapId: string) => {
        try {
            const response = await axios.delete(`http://localhost:3001/database/deleteMap/${uid}/${mapId}`);
            setSavedMaps(savedMaps.filter((map: any) => map.id !== mapId));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="btn btn-sm w-100 font-semibold transition-transform hover:scale-105" style={{ backgroundColor: "#dc2626", color: "#ffffff", border: "none" }}>Delete Map</button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#eeeeee] border-[#102b72]/20">
                <AlertDialogHeader>
                    <AlertDialogTitle style={{ color: "#102b72" }}>Are you sure you want to delete this map?</AlertDialogTitle>
                    <AlertDialogDescription style={{ color: "#102b72", opacity: 0.7 }}>
                        This action cannot be undone. This will permanently delete the map and remove it from your profile.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='d-flex justify-content-center'>
                    <AlertDialogCancel className="bg-white border border-[#102b72]/30 hover:bg-[#102b72]/10" style={{ color: "#102b72" }}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="font-semibold" style={{ backgroundColor: "#dc2626", color: "#ffffff" }} onClick={() => {
                        deleteMap(mapId);
                        toast("Map has been deleted", {
                            description: "The map has been deleted from your profile.",
                        });
                    }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
