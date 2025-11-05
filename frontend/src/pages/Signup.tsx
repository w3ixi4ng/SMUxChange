import { SignupForm } from "../components/SignupForm"



export default function Signup() {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10"
            style={{
                backgroundColor: "#eeeeee",
                color: "#102b72",
            }}
        >
           
            <div className="w-full max-w-sm md:max-w-4xl relative z-10">
                <SignupForm />
            </div>
        </div>
    )
}
