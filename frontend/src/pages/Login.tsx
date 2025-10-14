import { LoginForm } from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="bg-dark flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
