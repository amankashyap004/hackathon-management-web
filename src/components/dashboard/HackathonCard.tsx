import { Hackathon } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import Image from "next/image";
import React from "react";
import { FaEdit } from "react-icons/fa";
import Button from "../ui/Button";
import Link from "next/link";

const HackathonCard = ({
  hackathon,
  onPublishToggle,
  onEdit,
  onDelete,
  isCreator,
  isParticipant,
}: {
  hackathon: Hackathon;
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

export default HackathonCard;
