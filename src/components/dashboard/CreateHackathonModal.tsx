"use client";

import React, { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Hackathon } from "@/types";

const CreateHackathon = ({
  isOpen,
  onClose,
  onCreate,
  hackathon,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (hackathon: Hackathon) => void;
  hackathon?: Hackathon;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (hackathon) {
      setTitle(hackathon.title);
      setDescription(hackathon.description);
      setStartDate(hackathon.startDate);
      setEndDate(hackathon.endDate);
      setIsActive(hackathon.isActive);
    }
  }, [hackathon]);

  const handleSubmit = () => {
    const newHackathon = {
      id: hackathon ? hackathon.id : Date.now().toString(),
      title,
      description,
      startDate,
      endDate,
      isActive,
    };

    onCreate(newHackathon);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-lg">
      <div className="flex flex-col gap-4 bg-white/10 p-4 lg:p-6 rounded-md shadow-md w-full lg:w-1/2">
        <h2 className="text-xl font-semibold mb-4">
          {hackathon ? "Edit Hackathon" : "Create Hackathon"}
        </h2>
        <Input
          type="text"
          value={title}
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-md "
        />
        <Input
          value={description}
          placeholder="Enter description"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <Input
          type="date"
          placeholder="Enter start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <div>
          <input
            type="checkbox"
            id="active"
            className="mr-2 w-4 h-4"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="active" className="text-sm font-medium">
            Active
          </label>
        </div>

        <div className="flex justify-end w-full">
          <div className=" flex gap-4 w-full lg:w-1/2">
            <Button onClick={onClose} className="">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="secondary" className="">
              {hackathon ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHackathon;
