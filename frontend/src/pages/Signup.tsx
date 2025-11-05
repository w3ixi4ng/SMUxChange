import { SignupForm } from "../components/SignupForm"



export default function Signup() {
    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-10 relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
           
            <div className="w-full max-w-sm md:max-w-4xl relative z-10">
                <SignupForm />
            </div>
        </div>
    )
}
