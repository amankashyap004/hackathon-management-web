"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

import Layout from "@/components/wrappers/Layout";
import Container from "@/components/wrappers/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // console.log(email, password);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      console.log('User signed up successfully');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Layout>
      <Container>
        <div className="flex justify-center items-center min-h-screen w-full">
          <form
            onSubmit={handleSignup}
            className="bg-white/10 p-4 lg:p-8 rounded-lg shadow-md w-full max-w-xl"
          >
            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">
              Sign Up
            </h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Input
              inputId="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full"
            />
            <Input
              inputId="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full"
            />
            <Input
              inputId="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-2 w-full"
            />
            <div className="flex justify-end items-center w-full">
              <Link href="/login" className="text-sm">
                Already have an account?
              </Link>
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full mt-4 lg:mt-6"
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default Signup;
