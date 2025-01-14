"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { updateProfile, updatePassword, deleteUser } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import Layout from "@/components/wrappers/Layout";
import Container from "@/components/wrappers/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Profile() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
    } else {
      router.push("/");
    }
  }, [user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let photoURL = user.photoURL;

      if (photo) {
        const storageRef = ref(storage, `profile_photos/${user.uid}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName: name, photoURL });
      setSuccess("Profile updated successfully");
    } catch (error) {
      setError("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      setSuccess("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError("Failed to change password");
      console.error("Error changing password:", error);
    }
  };

  console.log(user);
  

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        // Delete user data from Firestore
        await deleteDoc(doc(db, "users", user.uid));
        // Delete user authentication
        await deleteUser(user);
        router.push("/");
      } catch (error) {
        setError("Failed to delete account");
        console.error("Error deleting account:", error);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Container className="mt-16">
        <div className="w-full py-6 lg:py-8">
          <h1 className="text-xl lg:text-3xl font-bold mb-6">
            Profile Management
          </h1>

          <form onSubmit={handleUpdateProfile} className="mb-8">
            <h2 className="text-lg lg:text-2xl font-bold mb-4">
              Update Profile: {name}
            </h2>
            <Input
              inputId="name"
              type="text"
              placeholder="Update your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 w-full"
            />
            <Input
              inputId="photo"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPhoto(e.target.files ? e.target.files[0] : null)
              }
              className="mb-4 w-full"
            />
            <Button type="submit" variant="secondary">
              Update Profile
            </Button>
          </form>

          <form onSubmit={handleChangePassword} className="mb-8">
            <h2 className="text-lg lg:text-2xl font-bold mb-4">
              Change Password
            </h2>

            <Input
              inputId="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-4 w-full"
            />
            <Input
              inputId="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-4 w-full"
            />

            <Button type="submit">Change Password</Button>
          </form>

          <div>
            <h2 className="text-lg lg:text-2xl font-bold mb-4">
              Delete Account
            </h2>
            <p className="mb-4">
              This action cannot be undone. All your data will be permanently
              deleted.
            </p>
            <Button
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete Account
            </Button>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
      </Container>
    </Layout>
  );
}
