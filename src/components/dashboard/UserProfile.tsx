"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

const UserProfile: React.FC = () => {
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  return (
    <div className="">
      <div className="flex flex-col gap-2 break-words">
        <p>Welcome: {name}</p>
        <p>{email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
