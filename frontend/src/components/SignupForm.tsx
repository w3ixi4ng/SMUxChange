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
import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
    try {
      const response = await axios.post('http://localhost:3001/signup', {
        email: email,
        password: password
    });
    if (response.data.success) {
        const uid = response.data.user.uid;
        sessionStorage.setItem('uid', uid);
        navigate('/login');
    }}
    catch (error: any) {
      setError(error.response.data.error);
      console.error(error);
    }
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
      <Card className="overflow-hidden p-0 border border-dark">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Create your SMUxChange account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Field>
                </Field>
                {error && <FieldDescription className="text-red-500">{error}</FieldDescription>}

              </Field>
              <Field>
                <Button type="submit" onClick={handleSignup}>Create Account</Button>
              </Field>

              
              <FieldDescription className="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="../public/images/oxford.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}