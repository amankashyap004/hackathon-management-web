import React from "react";
import Button from "../ui/Button";

const UserProfile = () => {
  return (
    <div className="h-full">
      <section>
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      </section>

      <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:bottom-6 lg:w-3/4 mt-4">
        <Button className="bg-red-500">Logout</Button>
      </div>
    </div>
  );
};

export default UserProfile;
