"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PiSpinnerBold } from "react-icons/pi";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDate } from "@/utils/dateUtils";
import Layout from "@/components/wrappers/Layout";
import Container from "@/components/wrappers/Container";
import Input from "@/components/ui/Input";
import { Hackathon } from "@/types";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Hackathons() {
  const { user } = useAuthContext();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  // prettier-ignore
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "past">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchHackathons() {
      setLoading(true);
      const hackathonsRef = collection(db, "hackathon-management-1");
      let q;

      if (filter === "all") {
        q = query(hackathonsRef); // Fetch all hackathons
      } else {
        q = query(hackathonsRef, where("status", "==", filter)); // Fetch filtered hackathons
      }

      const querySnapshot = await getDocs(q);
      const hackathonData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Hackathon)
      );

      // Filter published and unpublished hackathons
      const published = hackathonData.filter(
        (h) => h.published || h.creatorId === user?.uid // Show unpublished for creators
      );
      
      setHackathons(published);
      setLoading(false);
    }

    fetchHackathons();
  }, [filter]);

  const filteredHackathons = hackathons.filter((hackathon) =>
    hackathon.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Container className=" mt-20 ">
        <div className="flex flex-col gap-8 lg:gap-8 w-full min-h-screen">
          <div className="flex flex-col text-center">
            <h1 className="text-3xl lg:text-5xl font-bold">Hackathons</h1>
            <p className="text-sm lg:text-lg">
              Discover and participate in exciting hackathons
            </p>
          </div>

          <div className="flex mb-4">
            <Input
              type="text"
              placeholder="Search hackathons..."
              className="p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="ml-4 p-2 border rounded bg-black"
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value as "all" | "active" | "upcoming" | "past"
                )
              }
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 w-full">
            {loading ? (
              <div className="col-span-1 lg:col-span-3 flex justify-center items-center w-full p-4">
                <PiSpinnerBold className="animate-spin text-2xl lg:text-4xl" />
              </div>
            ) : filteredHackathons.length > 0 ? (
              filteredHackathons.map((hackathon) => (
                <Link
                  href={`/hackathon/${hackathon.id}`}
                  key={hackathon.id}
                  className="border rounded-md bg-white/5 drop-shadow-md hover:bg-white/10 p-4 transition-all duration-500"
                >
                  <div className="flex flex-col gap-4">
                    <p className="text-lg lg:text-2xl font-bold">
                      {hackathon.title}
                    </p>
                    <p className="text-sm lg:text-base">
                      {hackathon.description}
                    </p>
                    <div className="flex justify-between gap-2 text-xs lg:text-base">
                      <p className="px-3 lg:px-4 py-2 rounded-md bg-green-900">
                        Start: {formatDate(hackathon.startDate) || ""}
                      </p>
                      <p className="px-3 lg:px-4 py-2 rounded-md bg-red-900">
                        End: {formatDate(hackathon.endDate) || ""}
                      </p>
                    </div>
                    <div>
                      <p className="px-3 lg:px-4 py-2 rounded-md bg-pink-900">
                        Registration Deadline {hackathon?.registrationDeadline}
                      </p>
                    </div>
                    <Button>View</Button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-1 lg:col-span-3 flex justify-center items-center">
                <p>No hackathons found</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}
