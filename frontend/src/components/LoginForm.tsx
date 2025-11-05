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
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import axios from "axios";
import { toast } from "sonner"
import { LogIn } from "lucide-react"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const firebaseConfig = {
    apiKey: "AIzaSyB6K8DguE-HfOF2nsDWMACgKhCvMqHCjfg",
    authDomain: "smuxchange-f09b0.firebaseapp.com",
    databaseURL: "https://smuxchange-f09b0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smuxchange-f09b0",
    storageBucket: "smuxchange-f09b0.firebasestorage.app",
    messagingSenderId: "594685984997",
    appId: "1:594685984997:web:14e3d2cfa46b48fac8d40c",
    measurementId: "G-HNT1NFRBWT"
  };
  const app = initializeApp(firebaseConfig);

  const nav = useNavigate()
  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        sessionStorage.setItem("uid", user.uid);
        toast.loading("Logging in...");
        checkAdmin();
      })
      .catch((error) => {
        console.log(error);
        setError("Invalid email or password");
        toast.error("Invalid email or password");
      });
  }

  const checkAdmin = async () => {
    try {
      const uid = sessionStorage.getItem("uid");
      if (!uid) return;
      
      // Fetch user profile to get name
      try {
        const profileResponse = await axios.get(`https://smuxchange-backend.vercel.app/database/getProfile/${uid}`);
        if (profileResponse.data?.name) {
          sessionStorage.setItem("name", profileResponse.data.name);
          toast.dismiss();
          toast.success("Login successful");
        }
      } catch (profileError) {
        // User might not have a profile yet, that's okay
        console.log("Profile not found, user may need to create one");
      }
      
      // Dispatch authChange event to update navbar
      window.dispatchEvent(new Event('authChange'));
      
      const response = await axios.post('https://smuxchange-backend.vercel.app/database/checkAdmin', { uid });
      if (response.data.message === "admin") {
        nav("/admin");
      } else {
        nav("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  }


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function TypingAnimation({ text, speed = 100 }: { text: string; speed?: number }) {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
      setDisplayedText("");
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, [text, speed]);

    // Cursor blinking effect
    useEffect(() => {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);
      return () => clearInterval(cursorInterval);
    }, []);

    return (
      <span className="leading-none font-extrabold" style={{ fontFamily: 'inherit' }}>
        {displayedText}
        <span className={showCursor ? "opacity-100" : "opacity-0"}>|</span>
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border border-blue-200 shadow-xl bg-white/80 backdrop-blur-md rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 bg-white">
            <FieldGroup>
              <div className="flex flex-col items-center gap-4 text-center mb-6">
                <span className="inline-block">
                  <img src="/images/user.gif" alt="Login" className="w-24 h-24 animate-gif-pulse-profile" />
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 leading-none bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: 'inherit' }}>
                  <TypingAnimation text="Welcome Back" speed={100} />
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-medium">
                  Login to your SMUxChange account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email" className="text-blue-600 fw-bold">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                  style={{ color: "#1e293b" }}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-blue-600 fw-bold">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline text-blue-600 hover:text-blue-700"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                  style={{ color: "#1e293b" }}
                />
              </Field>
              {error && (
                <Field>
                  <FieldDescription className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium text-sm shadow-sm">
                    {error}
                  </FieldDescription>
                </Field>
              )}
              <Field>
                <Button
                  type="submit"
                  onClick={(e) => {
                    login(e);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 text-lg rounded shadow-2xl transition-all duration-300 hover:shadow-blue-500/50 w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Login
                  </span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                <span className="text-slate-600">
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">Sign up</a>
                </span>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-gradient-to-br from-blue-100 to-emerald-100 relative hidden md:block">
            <img
              src="/images/jewel.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}