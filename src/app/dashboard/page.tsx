"use client";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";

import CreateHackathon from "@/components/dashboard/CreateHackathonModal";
import UserProfile from "@/components/dashboard/UserProfile";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Hackathon } from "@/types";
import data from "../../data/data.json";

export default function DashboardPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>(
    data as Hackathon[]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(
    null
  );

  const toggleHackathonStatus = (id: string) => {
    setHackathons((prevHackathons) =>
      prevHackathons.map((hackathon) =>
        hackathon.id === id
          ? { ...hackathon, isActive: !hackathon.isActive }
          : hackathon
      )
    );
  };

  const createHackathon = (newHackathon: Hackathon) => {
    setHackathons((prevHackathons) => [...prevHackathons, newHackathon]);
  };

  const editHackathon = (updatedHackathon: Hackathon) => {
    setHackathons((prevHackathons) =>
      prevHackathons.map((hackathon) =>
        hackathon.id === updatedHackathon.id ? updatedHackathon : hackathon
      )
    );
    setEditingHackathon(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredHackathons = hackathons.filter(
    (hackathon) =>
      hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <UserProfile />
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
              hackathon.isActive ? "bg-red-600" : "bg-green-600"
            } hover:opacity-80`}
          >
            {hackathon.isActive ? "Deactivate" : "Activate"}
          </button>

          <button onClick={onEdit} className="text-xl lg:text-2xl">
            <FaEdit />
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm lg:text-base">{hackathon.description}</p>
      <div className="flex justify-between gap-2 mt-4 text-xs lg:text-base">
        <p className="px-3 lg:px-4 py-2 rounded-md bg-green-900">
          Start: {hackathon.startDate}
        </p>
        <p className="px-3 lg:px-4 py-2 rounded-md bg-red-900">
          End: {hackathon.endDate}
        </p>
      </div>
    </div>
  );
};
