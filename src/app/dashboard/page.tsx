"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";

import CreateHackathon from "@/components/dashboard/CreateHackathonModal";
import UserProfile from "@/components/dashboard/UserProfile";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Hackathon } from "@/types";

import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { formatDate } from "@/utils/dateUtils";

export default function DashboardPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(
    null
  );

  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchHackathons();
      router.push("/dashboard");
    }
  }, [user, router]);

  const fetchHackathons = async () => {
    try {
      const q = query(collection(db, "hackathon-management-1"));
      const querySnapshot = await getDocs(q);
      const hackathonList: Hackathon[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.name || "Untitled Hackathon",
          description: data.description || "",
          startDate: data.startDate?.toDate().toISOString() || "",
          endDate: data.endDate?.toDate().toISOString() || "",
          isActive: data.isActive || false,
        } as Hackathon;
      });
      setHackathons(hackathonList);
    } catch (error) {
      console.error("Error fetching hackathons:", error);
    }
  };

  const createHackathon = async (newHackathon: Hackathon) => {
    try {
      const docRef = await addDoc(collection(db, "hackathon-management-1"), {
        name: newHackathon.title,
        description: newHackathon.description,
        startDate: Timestamp.fromDate(new Date(newHackathon.startDate)),
        endDate: Timestamp.fromDate(new Date(newHackathon.endDate)),
        isActive: newHackathon.isActive,
      });
      setHackathons((prevHackathons) => [
        ...prevHackathons,
        { ...newHackathon, id: docRef.id },
      ]);
      console.log("Hackathon data added successfully.");
    } catch (error) {
      console.error("Error creating hackathon:", error);
    }
  };

  const toggleHackathonStatus = async (id: string) => {
    const hackathon = hackathons.find((h) => h.id === id);
    if (!hackathon) return;

    const newStatus = !hackathon.isActive;
    try {
      const docRef = doc(db, "hackathon-management-1", id);
      await updateDoc(docRef, { isActive: newStatus });
      setHackathons((prevHackathons) =>
        prevHackathons.map((h) =>
          h.id === id ? { ...h, isActive: newStatus } : h
        )
      );
      console.log("Updated hackathon status successfully");
    } catch (error) {
      console.error("Error updating hackathon status:", error);
    }
  };

  const editHackathon = async (updatedHackathon: Hackathon) => {
    try {
      const docRef = doc(db, "hackathon-management-1", updatedHackathon.id);
      await updateDoc(docRef, {
        name: updatedHackathon.title,
        description: updatedHackathon.description,
        startDate: Timestamp.fromDate(new Date(updatedHackathon.startDate)),
        endDate: Timestamp.fromDate(new Date(updatedHackathon.endDate)),
        isActive: updatedHackathon.isActive,
      });
      setHackathons((prevHackathons) =>
        prevHackathons.map((hackathon) =>
          hackathon.id === updatedHackathon.id ? updatedHackathon : hackathon
        )
      );
      setEditingHackathon(null);
      console.log("Updated hackathon successfully");
    } catch (error) {
      console.error("Error editing hackathon:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredHackathons = hackathons.filter(
    (hackathon) =>
      hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="p-4 lg:p-6 w-full min-h-screen">
      <div className="lg:flex flex-col lg:flex-row gap-16 w-full min-h-screen">
        <div className="hidden lg:block w-full lg:w-1/5" />
        <div className="lg:hidden flex justify-between items-center w-full gap-4 mb-6">
          <h2 className="text-xl font-semibold">Hackathons</h2>
          <Button
            variant="secondary"
            className="w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Create Hackathon
          </Button>
        </div>
        <div className="lg:fixed w-full lg:w-1/5 min-h-[93%] bg-white/5 p-4 rounded-md shadow-md overflow-hidden">
          <UserProfile user={user} />
        </div>

        <div className=" w-full lg:w-4/5 mt-6 lg:mt-0">
          <div className="hidden lg:flex justify-between items-center w-full gap-4  mb-6">
            <h2 className="text-xl font-semibold">Hackathons</h2>
            <div>
              <Button
                variant="secondary"
                className="w-auto"
                onClick={() => setIsModalOpen(true)}
              >
                Create Hackathon
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search hackathons..."
              className="w-full px-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredHackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon.id}
                hackathon={hackathon}
                onToggle={toggleHackathonStatus}
                onEdit={() => setEditingHackathon(hackathon)}
              />
            ))}
          </div>
        </div>
      </div>

      <CreateHackathon
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createHackathon}
      />

      {editingHackathon && (
        <CreateHackathon
          isOpen={!!editingHackathon}
          onClose={() => setEditingHackathon(null)}
          onCreate={editHackathon}
          hackathon={editingHackathon}
        />
      )}
    </div>
  );
}

const HackathonCard = ({
  hackathon,
  onToggle,
  onEdit,
}: {
  hackathon: Hackathon;
  onToggle: (id: string) => void;
  onEdit: () => void;
}) => {
  return (
    <div className="relative border rounded-md bg-white/5 drop-shadow-md hover:bg-white/10 p-4 transition-all duration-500">
      <div className="flex justify-between items-start gap-2">
        <p className="text-lg lg:text-2xl font-bold">{hackathon.title}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onToggle(hackathon.id)}
            className={`px-2 py-2 text-xs rounded-md text-white ${
              hackathon.isActive ? "bg-green-600" : "bg-red-600"
            } hover:opacity-80`}
          >
            {hackathon.isActive ? "Activate" : "Deactivate"}
          </button>

          <button onClick={onEdit} className="text-xl lg:text-2xl">
            <FaEdit />
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm lg:text-base">{hackathon.description}</p>
      <div className="flex justify-between gap-2 mt-4 text-xs lg:text-base">
        <p className="px-3 lg:px-4 py-2 rounded-md bg-green-900">
          Start: {formatDate(hackathon.startDate) || ""}
        </p>
        <p className="px-3 lg:px-4 py-2 rounded-md bg-red-900">
          End: {formatDate(hackathon.endDate) || ""}
        </p>
      </div>
    </div>
  );
};
