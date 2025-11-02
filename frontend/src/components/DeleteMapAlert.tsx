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

export function DeleteMapAlert({ uid, mapId, setSavedMaps }: { uid: string, mapId: string, setSavedMaps: (maps: any) => void }) {
    const deleteMap = async (mapId: string) => {
        try {
            await axios.delete(`http://localhost:3001/database/deleteMap/${uid}/${mapId}`);
            // Use function form to ensure we're working with the latest state
            setSavedMaps((prev: any[]) => {
                const filtered = prev.filter((m: any) => String(m.id) !== String(mapId));
                return filtered;
            });
            toast.success("Map has been deleted", {
                description: "The map has been deleted from your profile.",
            });
        } catch (error) {
            console.log(error);
            toast.error("Error deleting map", {
                description: "Please try again.",
            });
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
                    <AlertDialogAction className="font-semibold bg-destructive text-white border-none" onClick={async () => {
                        await deleteMap(mapId);
                    }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
