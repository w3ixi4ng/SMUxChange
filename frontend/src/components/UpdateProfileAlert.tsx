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
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/database/saveProfile', { uid, name, faculty, major, track, secondMajor });
            setErrorMessage([]);
        } catch (error) {
            console.log("API error saving profile:", error);
        }
    };

    return (
        
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="bg-white text-black font-semibold hover:bg-gray-200 hover:scale-105 transition-transform px-8 py-2 text-lg rounded-full shadow-lg rounded">
                    Edit Profile
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
                        toast("Profile updated", {
                            description: "Your profile has been updated successfully.",
                        });
                    }}>
                        Update
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
