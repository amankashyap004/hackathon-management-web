"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// prettier-ignore
import { collection, query, getDocs, addDoc, Timestamp, doc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { useAuthContext } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import CreateHackathon from "@/components/dashboard/CreateHackathonModal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import HackathonCard from "@/components/dashboard/HackathonCard";
import { Hackathon } from "@/types";
import { PiSpinnerBold } from "react-icons/pi";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  // prettier-ignore
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  // prettier-ignore
  const [participatedHackathons, setParticipatedHackathons] = useState<Hackathon[]>([]);
  const [createdHackathons, setCreatedHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    if (!user) {
      // router.push("/login");
      localStorage.removeItem("user");
    } else {
      fetchHackathons();
    }
  }, [user]);

  const fetchHackathons = async () => {
    if (!user) return;

    const allHackathonsQuery = query(collection(db, "hackathon-management-1"));
    const allHackathonsSnapshot = await getDocs(allHackathonsQuery);
    const allHackathonsData = allHackathonsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Hackathon)
    );

    const participated = allHackathonsData.filter((h) =>
      h.participants?.includes(user.uid)
    );
    const created = allHackathonsData.filter((h) => h.creatorId === user.uid);
    const published = allHackathonsData.filter((h) => h.published);

    setParticipatedHackathons(participated);
    setCreatedHackathons(created);
    setHackathons(published);
  };

  console.log(participatedHackathons);

  const toggleHackathonPublish = async (id: string) => {
    const hackathon = createdHackathons.find((h) => h.id === id);
    if (!hackathon || hackathon.creatorId !== user?.uid) return;

    try {
      const docRef = doc(db, "hackathon-management-1", id);
      await updateDoc(docRef, { published: !hackathon.published });
      await fetchHackathons();
      console.log("Updated hackathon publish status successfully");
    } catch (error) {
      console.error("Error updating hackathon publish status:", error);
    }
  };

  const handleCreateOrUpdateHackathon = async (updatedHackathon: Hackathon) => {
    if (!user) {
      console.error("User must be logged in to create or update a hackathon");
      return;
    }



    try {
      if (updatedHackathon.id) {
        // Update existing hackathon
        const docRef = doc(db, "hackathon-management-1", updatedHackathon.id);
        await updateDoc(docRef, { ...updatedHackathon });
      } else {
        // Create new hackathon
        const docRef = await addDoc(collection(db, "hackathon-management-1"), {
          ...updatedHackathon,
          creatorId: user.uid,
          participants: [user.uid],
          createdAt: Timestamp.now(),
        });
        updatedHackathon.id = docRef.id;
      }
      await fetchHackathons();
      console.log("Hackathon created/updated successfully");
    } catch (error) {
      console.error("Error creating/updating hackathon:", error);
    }
  };

  const handleJoinHackathon = async (hackathonId: string) => {
    if (!user) {
      console.error("User must be logged in to join a hackathon");
      router.push("/login");
      return;
    }

    try {
      const docRef = doc(db, "hackathon-management-1", hackathonId);
      await updateDoc(docRef, {
        participants: arrayUnion(user.uid),
      });
      await fetchHackathons();
      console.log("Joined hackathon successfully");
    } catch (error) {
      console.error("Error joining hackathon:", error);
    }
  };

  const handleDeleteHackathon = async (hackathonId: string) => {
    if (!user) {
      console.error("User must be logged in to delete a hackathon");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this hackathon? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const docRef = doc(db, "hackathon-management-1", hackathonId);
      await deleteDoc(docRef);
      await fetchHackathons();
      console.log("Deleted hackathon successfully");
    } catch (error) {
      console.error("Error deleting hackathon:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch = hackathon.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const now = new Date();
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && hackathon.status === "active";
    if (activeTab === "upcoming")
      return matchesSearch && new Date(hackathon.startDate) > now;
    if (activeTab === "past")
      return matchesSearch && new Date(hackathon.endDate) < now;
    if (activeTab === "joined")
      return matchesSearch && hackathon.participants?.includes(user?.uid || "");
    return matchesSearch;
  });

  const openHackathonModal = (hackathon: Hackathon | null) => {
    if (!user) {
      console.error("User must be logged in to view hackathon details");
      router.push("/login");
      return;
    }
    setSelectedHackathon(hackathon);
    setIsModalOpen(true);
  };

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center gap-8 h-screen">
        <PiSpinnerBold className="animate-spin text-2xl lg:text-4xl " />
        <Button onClick={() => router.push("/login")} className="!w-auto">
          Login to view hackathons
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="lg:flex flex-col lg:flex-row gap-16 w-full min-h-screen">
        <div className="lg:hidden flex justify-between items-center w-full gap-4 mb-6">
          <h2 className="text-xl font-semibold">Hackathons</h2>
          <Button
            variant="secondary"
            className="w-auto"
            onClick={() => openHackathonModal(null)}
          >
            Create Hackathon
          </Button>
        </div>

        <div className="w-full mt-6 lg:mt-0">
          <div className="hidden lg:flex justify-between items-center w-full gap-4 mb-6">
            <h2 className="text-xl font-semibold">Hackathons</h2>
            <div>
              <Button
                variant="secondary"
                className="w-auto"
                onClick={() => openHackathonModal(null)}
              >
                Create Hackathon
              </Button>
            </div>
          </div>

          <div className="flex gap-4 mb-8 lg:mb-4 overflow-x-auto">
            {["All", "active", "upcoming", "past", "joined"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded ${
                  activeTab === tab ? "bg-blue-900 text-white" : "bg-gray-900"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchTerm(""); // Reset search term on tab change
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <section className="flex gap-4 w-full ">
            <div className="mb-6 w-full">
              <Input
                type="text"
                placeholder="Search hackathons..."
                className="w-full px-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredHackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon.id}
                hackathon={hackathon}
                onPublishToggle={toggleHackathonPublish}
                onEdit={() => openHackathonModal(hackathon)}
                onDelete={() => handleDeleteHackathon(user.uid)}
                isCreator={hackathon.creatorId === user.uid}
                isParticipant={hackathon?.participants?.includes(user.uid)}
              />
            ))}
          </div>
        </div>
      </div>

      <CreateHackathon
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateOrUpdateHackathon}
        onJoin={handleJoinHackathon}
        hackathon={selectedHackathon}
        isCreator={
          selectedHackathon ? selectedHackathon.creatorId === user.uid : true
        }
      />
    </div>
  );
}
