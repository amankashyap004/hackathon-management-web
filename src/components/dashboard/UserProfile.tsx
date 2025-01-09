import React from "react";
import Button from "../ui/Button";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

type UserProfileProps = {
  user: {
    uid: string | null;
    email: string | null;
  };
};

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const router = useRouter();

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
          <p>User ID: {user.uid}</p>
          <p>Email: {user.email}</p>
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
