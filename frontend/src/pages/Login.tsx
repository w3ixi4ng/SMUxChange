import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
      {/* Grid overlay pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, #2563eb 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}></div>
      
      <div className="flex flex-col items-center justify-center p-6 md:p-10 relative z-10 min-h-screen">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
