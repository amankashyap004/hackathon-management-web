"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
// prettier-ignore
import { collection, query, getDocs, addDoc, Timestamp, doc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { useAuthContext } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { formatDate } from "@/utils/dateUtils";
import CreateHackathon from "@/components/dashboard/CreateHackathonModal";
import UserProfile from "@/components/dashboard/UserProfile";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Hackathon } from "@/types";

export default function DashboardPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // prettier-ignore
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  // prettier-ignore
  const [participatedHackathons, setParticipatedHackathons] = useState<Hackathon[]>([]);
  const [createdHackathons, setCreatedHackathons] = useState<Hackathon[]>([]);

  const { user } = useAuthContext();
  const router = useRouter();

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

  const toggleHackathonStatus = async (id: string) => {
    const hackathon = hackathons.find((h) => h.id === id);
    if (!hackathon || hackathon.creatorId !== user?.uid) return;

    const newStatus = hackathon.status === "active" ? "upcoming" : "active";
    try {
      const docRef = doc(db, "hackathon-management-1", id);
      await updateDoc(docRef, { status: newStatus });
      await fetchHackathons();
      console.log("Updated hackathon status successfully");
    } catch (error) {
      console.error("Error updating hackathon status:", error);
    }
  };

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

  const filteredHackathons = hackathons.filter(
    (hackathon) =>
      hackathon.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      hackathon.description?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const openHackathonModal = (hackathon: Hackathon | null) => {
    if (!user) {
      console.error("User must be logged in to view hackathon details");
      router.push("/login");
      return;
    }
    setSelectedHackathon(hackathon);
    setIsModalOpen(true);
  };

  console.log(participatedHackathons);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Button onClick={() => router.push("/login")}>
          Login to view hackathons
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 w-full min-h-screen">
      <div className="lg:flex flex-col lg:flex-row gap-16 w-full min-h-screen">
        <div className="hidden lg:block w-full lg:w-1/5" />
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
        <div className="lg:fixed w-full lg:w-1/5 min-h-[93%] bg-white/5 p-4 rounded-md shadow-md overflow-hidden">
          <UserProfile />
        </div>

        <div className="w-full lg:w-4/5 mt-6 lg:mt-0">
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
                onPublishToggle={toggleHackathonPublish}
                onEdit={() => openHackathonModal(hackathon)}
                onDelete={() => handleDeleteHackathon(user.uid)}
                isCreator={hackathon.creatorId === user.uid}
                isParticipant={hackathon?.participants?.includes(user.uid)}
              />
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Your Hackathons</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {createdHackathons.map((hackathon) => (
                <HackathonCard
                  key={hackathon.id}
                  hackathon={hackathon}
                  onToggle={toggleHackathonStatus}
                  onPublishToggle={toggleHackathonPublish}
                  onEdit={() => openHackathonModal(hackathon)}
                  onDelete={() => handleDeleteHackathon(hackathon.id)}
                  isCreator={true}
                  isParticipant={true}
                />
              ))}
            </div>
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

const HackathonCard = ({
  hackathon,
  onToggle,
  onPublishToggle,
  onEdit,
  onDelete,
  isCreator,
  isParticipant,
}: {
  hackathon: Hackathon;
  onToggle: (id: string) => void;
  onPublishToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  isCreator: boolean;
  isParticipant: boolean | undefined;
}) => {
  return (
    <div className="relative border rounded-md bg-white/5 drop-shadow-md hover:bg-white/10 p-4 transition-all duration-500">
      {hackathon.thumbnailUrl && (
        <div className="mb-4">
          <Image
            src={hackathon.thumbnailUrl}
            alt={hackathon.title}
            width={300}
            height={200}
            className="w-full h-40 object-cover rounded-md"
          />
        </div>
      )}
      <div className="flex justify-between items-start gap-2">
        <p className="text-lg lg:text-2xl font-bold">{hackathon.title}</p>
        <div className="flex gap-2">
          {isCreator && (
            <button onClick={onEdit} className="text-xl lg:text-xl z-50">
              <FaEdit />
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm lg:text-base">{hackathon.description}</p>
      <div className="flex justify-between gap-2 mt-4 text-xs lg:text-base">
        <p className="px-3 lg:px-4 py-2 rounded-md bg-green-900">
          Start: {formatDate(hackathon.startDate)}
        </p>
        <p className="px-3 lg:px-4 py-2 rounded-md bg-red-900">
          End: {formatDate(hackathon.endDate)}
        </p>
      </div>

      {isParticipant && (
        <div className="mt-4 text-sm text-green-500">
          You are participating in this hackathon
        </div>
      )}
      {!isParticipant && (
        <div className="mt-4 text-sm text-red-500">
          You are not participating in this hackathon
        </div>
      )}

      <div className="mt-4">
        {isCreator ? (
          <div className="flex gap-2 lg:gap-3">
            <Button
              onClick={() => onToggle(hackathon.id)}
              className={`capitalize ${
                hackathon.status === "active" ? "bg-green-600" : "bg-red-600"
              } hover:opacity-80`}
            >
              {hackathon.status}
            </Button>
            <Button
              onClick={() => onPublishToggle(hackathon.id)}
              className={`${
                hackathon.published ? "bg-red-600" : "bg-green-600"
              } hover:opacity-80`}
            >
              {hackathon.published ? "Unpublish" : "Publish"}
            </Button>

            <Button onClick={onDelete} className="bg-red-600 hover:opacity-80">
              Delete
            </Button>
          </div>
        ) : (
          <Button
            className={`capitalize ${
              hackathon.status === "active" ? "bg-green-600" : "bg-red-600"
            } hover:opacity-80`}
          >
            {hackathon.status}
          </Button>
        )}
      </div>

      <Link href={`/hackathon/${hackathon.id}`}>
        <Button className="mt-4">View Hackathon</Button>
      </Link>
    </div>
  );
};
