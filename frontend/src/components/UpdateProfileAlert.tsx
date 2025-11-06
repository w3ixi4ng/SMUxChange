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
import { UserCog } from "lucide-react";

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
                <button className="group relative overflow-hidden bg-blue-600 text-white font-bold px-8 py-2 text-lg rounded shadow-2xl transition-all duration-300 hover:shadow-blue-500/50 hover:bg-blue-700 animate-jump-hover d-inline-flex align-items-center gap-2">
                    <span className="relative z-10 d-inline-flex align-items-center gap-2">
                        <UserCog className="w-5 h-5" />
                        <span>Update Profile</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
                    <AlertDialogCancel className="bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-700" onClick={() => {
                        saveProfile(uid || "", name, faculty, major, track, secondMajor);
                    }}>
                        Update
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
