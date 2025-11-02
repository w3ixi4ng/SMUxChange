import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10"
      style={{
        backgroundColor: "#eeeeee",
        color: "#102b72",
      }}
    >
      {/* === Subtle gradient + grid overlay === */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,43,114,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="w-full max-w-sm md:max-w-4xl relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
