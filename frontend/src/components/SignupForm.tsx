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
      <Card className="overflow-hidden p-0 border border-[#102b72]/20 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 bg-white">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="inline-block ml-2"><img src="/images/add.gif" alt="Signup" className="w-30 h-30" /></span>
                <h1 className="text-2xl font-bold" style={{ color: "#102b72" }}>Create your account</h1>
                <p className="text-sm text-balance" style={{ color: "#102b72" }}>
                  Create your SMUxChange account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email" style={{ color: "#102b72" }}>Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-[#102b72]/30"
                  style={{ color: "#102b72" }}
                  value={email}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password" style={{ color: "#102b72" }}>Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border border-[#102b72]/30"
                      style={{ color: "#102b72" }}
                      value={password}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password" style={{ color: "#102b72" }}>
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white border border-[#102b72]/30"
                      style={{ color: "#102b72" }}
                      value={confirmPassword}
                    />
                  </Field>
                </Field>
                {error && <FieldDescription className="text-red-600">{error}</FieldDescription>}

              </Field>
              <Field>
                <Button
                  type="submit"
                  onClick={handleSignup}
                  style={{ backgroundColor: "#102b72", color: "#ffffff" }}
                >
                  Create Account
                </Button>
              </Field>


              <FieldDescription className="text-center">
                <span style={{ color: "#102b72" }}>
                  Already have an account?{" "}
                  <a href="/login" style={{ color: "#2563eb" }}>Sign in</a>
                </span>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-gray-100 relative hidden md:block">
            <img
              src="/images/london.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}