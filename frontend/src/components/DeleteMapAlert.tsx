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
                <button className="btn btn-outline-danger btn-sm w-100">Delete Map</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this map?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the map and remove it from your profile.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='d-flex justify-content-center'>
                    <AlertDialogCancel className="">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-white"  onClick={() => {
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
