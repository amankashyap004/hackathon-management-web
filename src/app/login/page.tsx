"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// prettier-ignore
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthContext } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import Layout from "@/components/wrappers/Layout";
import Container from "@/components/wrappers/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
      console.log("User logged in successfully");
    } catch (error) {
      setError("Failed to log in");
      console.error("Error logging in:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to log in with Google");
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <Layout>
      <Container>
        <div className="flex justify-center items-center min-h-screen w-full">
          <form
            onSubmit={handleEmailLogin}
            className="bg-white/10 p-4 lg:p-8 rounded-lg shadow-md w-full max-w-xl"
          >
            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">
              Log In
            </h2>

            <Input
              inputId="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Input
              inputId="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end items-center w-full">
              <Link href="/signup" className="text-sm">
                Don&apos;t have an account?
              </Link>
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full mt-4 lg:mt-6"
            >
              Log In
            </Button>

            <div className="w-full mt-4 lg:mt-6">
              <Button
                onClick={handleGoogleLogin}
                className="w-full mt-4 lg:mt-6"
              >
                Sign in with Google
              </Button>
            </div>

            <div className="bg-white/10 p-3 rounded-md mt-4 text-xs lg:text-sm">
              <p>You can use the following demo account for login.</p>
              <ul className="mt-2 ml-4 list-disc break-words">
                <li>
                  Email:{" "}
                  <span className="font-semibold">
                    demo1@hackathonmanagementweb.com
                  </span>
                </li>
                <li>
                  Password: <span className="font-semibold">123456</span>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default Login;
