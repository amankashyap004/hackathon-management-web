"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// prettier-ignore
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/lib/firebase";
import Layout from "@/components/wrappers/Layout";
import Container from "@/components/wrappers/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (photo) {
        const storageRef = ref(storage, `profile_photos/${user.uid}`);
        await uploadBytes(storageRef, photo);
        const photoURL = await getDownloadURL(storageRef);
        await updateProfile(user, { displayName: name, photoURL });
      } else {
        await updateProfile(user, { displayName: name });
      }

      router.push("/dashboard");
      console.log("User signed up successfully");
    } catch (error) {
      setError("Failed to sign up");
      console.error("Error signing up:", error);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to sign up with Google");
      console.error("Error signing up:", error);
    }
  };

  return (
    <Layout>
      <Container>
        <div className="flex justify-center items-center min-h-screen w-full">
          <form
            onSubmit={handleEmailSignup}
            className="bg-white/10 p-4 lg:p-8 rounded-lg shadow-md w-full max-w-xl"
          >
            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">
              Sign Up
            </h2>

            <Input
              inputId="name"
              name="name"
              type="text"
              placeholder="Name"
              className="mb-4 w-full"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              inputId="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="mb-4 w-full"
              // prettier-ignore
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
            />
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
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
            <Button
              onClick={handleGoogleSignup}
              className="w-full mt-4 lg:mt-6"
            >
              Sign up with Google
            </Button>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default Signup;
