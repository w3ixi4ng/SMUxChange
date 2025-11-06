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
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

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

export function SignupForm({
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
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (error !== "") {
      return;
    }
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        sessionStorage.setItem("uid", user.uid);
          // Dispatch authChange event to update navbar
        window.dispatchEvent(new Event('authChange'));
        toast.loading("Signing up...");
        toast.dismiss();
        toast.success("Signup successful");
        navigate("/profile");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setError("Email already in use");
          toast.error("Email already in use");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          console.log(error);
        }
        else if (error.code === "auth/invalid-email") {
          setError("Invalid email");
          toast.error("Invalid email");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          console.log(error);
        }
      })
  };

  useEffect(() => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters long");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border border-blue-200 shadow-xl bg-white/80 backdrop-blur-md rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 bg-white">
            <FieldGroup>
              <div className="flex flex-col items-center gap-4 text-center mb-6">
                <span className="inline-block">
                  <img src="/images/add.gif" alt="Signup" className="w-24 h-24 animate-gif-pulse-profile" />
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 leading-none bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: 'inherit' }}>
                  <TypingAnimation text="Create Account" speed={100} />
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-medium">
                  Create your SMUxChange account
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
                  value={email}
                />
              </Field>
              <Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password" className="text-blue-600 fw-bold">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                      style={{ color: "#1e293b" }}
                      value={password}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password" className="text-blue-600 fw-bold">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                      style={{ color: "#1e293b" }}
                      value={confirmPassword}
                    />
                  </Field>
                </div>
                {error && (
                  <FieldDescription className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium text-sm shadow-sm mt-4">
                    {error}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  onClick={handleSignup}
                  disabled={error !== ""}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 text-lg rounded shadow-2xl transition-all duration-300 hover:shadow-blue-500/50 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                <span className="text-slate-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</a>
                </span>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-gradient-to-br from-blue-100 to-emerald-100 relative hidden md:block">
            <img
              src="/images/london.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}