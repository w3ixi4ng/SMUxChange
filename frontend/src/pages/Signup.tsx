import { SignupForm } from "../components/SignupForm"



export default function Signup() {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 text-white 
                        bg-[#0a0a0a] 
                        bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06)_0%,transparent_25%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.04)_0%,transparent_30%)]"
        >
            <div className="w-full max-w-sm md:max-w-4xl">
                <SignupForm />
            </div>
        </div>
    )
}
