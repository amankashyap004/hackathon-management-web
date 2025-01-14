"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { useAuthContext } from "@/contexts/AuthContext";
import Button from "../ui/Button";

const UserProfile: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="h-full">
      <section>
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <div className="flex flex-col gap-2 break-words">
          <p>Name: {name}</p>
          <p>Email: {email}</p>
        </div>

        <div className="py-4">
          <Button onClick={() => router.push("/profile")} variant="secondary">
            Profile
          </Button>
        </div>
      </section>

      <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:bottom-6 lg:w-3/4 mt-4">
        <Button onClick={handleLogout} className="bg-red-500">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
