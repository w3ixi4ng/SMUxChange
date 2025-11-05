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

type propsTypes = {
    uid: string,
    name: string,
    faculty: string,
    major: string,
    track: string,
    secondMajor: string
    setErrorMessage: (errors: string[]) => void
}

export function UpdateProfileAlert({ uid, name, faculty, major, track, secondMajor, setErrorMessage }: propsTypes) {

    const saveProfile = async (uid: any, name: string, faculty: string, major: string, track: string, secondMajor: string) => {
        let errors = [];
        if (name === "") {
            errors.push("Name is required");
        }
        if (faculty === "") {
            errors.push("Faculty is required");
        }
        if (major === "") {
            errors.push("Major is required");

        }
        if (errors.length > 0) {
            setErrorMessage(errors);
            toast.error("Profile update failed", {
                description: "Please check your inputs and try again.",
            });
            return;
        } else {

            try {
                await axios.post('https://smuxchange-backend.vercel.app/database/saveProfile', { uid, name, faculty, major, track, secondMajor });
                // Update sessionStorage after successful save
                sessionStorage.setItem("name", name);
                sessionStorage.setItem("faculty", faculty);
                sessionStorage.setItem("major", major);
                sessionStorage.setItem("track", track);
                sessionStorage.setItem("secondMajor", secondMajor);
                setErrorMessage([]);
                toast.success("Profile updated successfully", {
                    description: "Your profile has been updated successfully.",
                });
            } catch (error) {
                console.log("API error saving profile:", error);
                toast.error("Profile update failed", {
                    description: "Please check your inputs and try again.",
                });
            }
        }
    };

    return (

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="bg-white text-black font-semibold hover:bg-gray-200 hover:scale-105 transition-transform px-8 py-2 text-lg rounded-full shadow-lg rounded">
                    Update Profile
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Update?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to update your profile?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='d-flex justify-content-center'>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        saveProfile(uid || "", name, faculty, major, track, secondMajor);
                    }}>
                        Update
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
