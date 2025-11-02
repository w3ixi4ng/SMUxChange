import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const nav = useNavigate()
  const login = async(e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: email,
        password: password
    });
    if (response.data.success) {
        // const uid = response.data.user.uid;
        // sessionStorage.setItem('uid', uid);
        // nav('/profile');
        const user = response.data.user;
        // Store login state for entire app
        sessionStorage.setItem("uid", user.uid);
        sessionStorage.setItem("email", user.email);
        sessionStorage.setItem("name", user.displayName || "");
        // Dispatch custom event to notify navbar of login
        window.dispatchEvent(new Event('authChange'));
        // Redirect after login
        if (sessionStorage.getItem('backToUrl')) {
          window.location.href = sessionStorage.getItem('backToUrl') || "/profile";
        } else {
        nav("/profile");
        }
    }}
    catch (error: any) {
      setError("Invalid email or password");
      console.error(error);
    }
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border border-[#102b72]/20 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 bg-white">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold" style={{ color: "#102b72" }}>Welcome back</h1>
                <p className="text-sm text-balance" style={{ color: "#102b72" }}>
                  Login to your SMUxChange account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email" style={{ color: "#102b72" }}>Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange= {(e) => setEmail(e.target.value)}
                  className="bg-white border border-[#102b72]/30"
                  style={{ color: "#102b72" }}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" style={{ color: "#102b72" }}>Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                    style={{ color: "#2563eb" }}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border border-[#102b72]/30"
                  style={{ color: "#102b72" }}
                />
              </Field>
              <Field>
              <FieldDescription className="text-red-600">{error}</FieldDescription>
              </Field>
              <Field>
                <Button 
                  type="submit" 
                  onClick={(e) => {
                    login(e);
                  }}
                  style={{ backgroundColor: "#102b72", color: "#ffffff" }}
                >
                  Login
                </Button>
              </Field>
              <FieldDescription className="text-center">
                <span style={{ color: "#102b72" }}>
                  Don&apos;t have an account?{" "}
                  <a href="/signup" style={{ color: "#2563eb" }}>Sign up</a>
                </span>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-gray-100 relative hidden md:block">
            <img
              src="/images/jewel.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}