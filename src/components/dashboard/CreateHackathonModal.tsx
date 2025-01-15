"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { addDoc, collection, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthContext } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Hackathon } from "@/types";

interface CreateHackathonProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (hackathon: Hackathon) => void;
  onJoin: (hackathonId: string) => void;
  hackathon?: Hackathon | null;
  isCreator: boolean;
}

const CreateHackathon: React.FC<CreateHackathonProps> = ({
  isOpen,
  onClose,
  onCreate,
  onJoin,
  hackathon,
  isCreator,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [rules, setRules] = useState("");
  const [prizes, setPrizes] = useState("");
  const [status, setStatus] = useState<"upcoming" | "active" | "past" | undefined>("upcoming");
  const [published, setPublished] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (hackathon) {
      setTitle(hackathon.title);
      setDescription(hackathon.description);
      setStartDate(hackathon.startDate);
      setEndDate(hackathon.endDate);
      setRegistrationDeadline(hackathon.registrationDeadline || "");
      setRules(hackathon.rules || "");
      setPrizes(hackathon.prizes || "");
      setStatus(hackathon.status || "upcoming");
      setPublished(hackathon.published || false);
      setThumbnailPreview(hackathon.thumbnailUrl || null);
    } else {
      resetForm();
    }
  }, [hackathon]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setRegistrationDeadline("");
    setRules("");
    setPrizes("");
    setStatus("upcoming");
    setPublished(false);
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User must be logged in to create or edit a hackathon");
      return;
    }

    let thumbnailUrl = hackathon?.thumbnailUrl || "";

    if (thumbnail) {
      const storageRef = ref(storage, `hackathon_thumbnails/${Date.now()}_${thumbnail.name}`);
      await uploadBytes(storageRef, thumbnail);
      thumbnailUrl = await getDownloadURL(storageRef);
    }

    const hackathonData: Omit<Hackathon, "id" | "participantCount"> = {
      title,
      description,
      startDate,
      endDate,
      registrationDeadline,
      rules,
      prizes,
      status,
      published,
      thumbnailUrl,
      creatorId: user.uid,
      participants: hackathon?.participants || [user.uid],
    };

    try {
      if (hackathon && isCreator) {
        // Update existing hackathon
        await updateDoc(
          doc(db, "hackathon-management-1", hackathon.id),
          hackathonData
        );
        onCreate({
          ...hackathonData,
          id: hackathon.id,
          participantCount: hackathon?.participants?.length,
        });
      } else {
        // Create new hackathon
        const docRef = await addDoc(collection(db, "hackathon-management-1"), {
          ...hackathonData,
          createdAt: new Date().toISOString(),
        });
        onCreate({ ...hackathonData, id: docRef.id, participantCount: 1 });
      }
      onClose();
    } catch (error) {
      console.error("Error creating/updating hackathon:", error);
    }
  };

  const handleJoin = async () => {
    if (!user || !hackathon) {
      console.error("User must be logged in and hackathon must exist to join");
      return;
    }

    try {
      await updateDoc(doc(db, "hackathons", hackathon.id), {
        participants: arrayUnion(user.uid),
      });
      onJoin(hackathon.id);
      onClose();
    } catch (error) {
      console.error("Error joining hackathon:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-lg">
      <div className="bg-white/10 p-4 lg:p-6 rounded-md shadow-md w-full lg:w-2/3 h-[85vh] overflow-auto">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-4">
            {hackathon
              ? isCreator
                ? "Edit Hackathon"
                : "Hackathon Details"
              : "Create Hackathon"}
          </h2>
          <Input
            type="text"
            value={title}
            placeholder="Enter title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            disabled={!isCreator && !!hackathon}
          />
          <textarea
            value={description}
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md resize-vertical bg-transparent"
            rows={4}
            disabled={!isCreator && !!hackathon}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              inputId="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              disabled={!isCreator && !!hackathon}
            />
            <Input
              label="End Date"
              inputId="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              disabled={!isCreator && !!hackathon}
            />
          </div>
          <Input
            label="Registration Deadline"
            inputId="registrationDeadline"
            type="date"
            value={registrationDeadline}
            onChange={(e) => setRegistrationDeadline(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            disabled={!isCreator && !!hackathon}
          />
          <textarea
            value={rules}
            placeholder="Enter rules"
            onChange={(e) => setRules(e.target.value)}
            className="w-full px-4 py-2 border rounded-md resize-vertical bg-transparent"
            rows={4}
            disabled={!isCreator && !!hackathon}
          />
          <textarea
            value={prizes}
            placeholder="Enter prizes"
            onChange={(e) => setPrizes(e.target.value)}
            className="w-full px-4 py-2 border rounded-md resize-vertical bg-transparent"
            rows={4}
            disabled={!isCreator && !!hackathon}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Hackathon["status"])}
            className="w-full px-4 py-2.5 border rounded-md bg-[#1B1C1E]"
            disabled={!isCreator && !!hackathon}
          >
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="past">Past</option>
          </select>
          {isCreator && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="published">
                {published ? "Unpublish Hackathon" : "Publish Hackathon"}
              </label>
            </div>
          )}
          <div className="flex flex-col items-start">
            <label htmlFor="thumbnail" className="mb-2">Thumbnail Image</label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="mb-2"
              disabled={!isCreator && !!hackathon}
            />
            {thumbnailPreview && (
              <Image
                src={thumbnailPreview}
                alt="Thumbnail preview"
                width={100}
                height={100}
                quality={100}
                className="w-32 h-32 object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-end w-full">
            <div className="flex gap-4 w-full md:w-1/2">
              <Button onClick={onClose} className="w-full">
                Cancel
              </Button>
              {isCreator || !hackathon ? (
                <Button
                  onClick={handleSubmit}
                  variant="secondary"
                  className="w-full"
                >
                  {hackathon ? "Save Changes" : "Create"}
                </Button>
              ) : (
                <Button
                  onClick={handleJoin}
                  variant="secondary"
                  className="w-full"
                >
                  Join Hackathon
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHackathon;
