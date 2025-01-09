"use client";

import { useState, useEffect } from "react";
import Container from "../wrappers/Container";
import { Hackathon } from "@/types";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { PiSpinnerBold } from "react-icons/pi";
import { formatDate } from "@/utils/dateUtils";

export default function HackathonList() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveHackathons = async () => {
      try {
        const q = query(
          collection(db, "hackathon-management-1"),
          where("isActive", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const activeHackathons: Hackathon[] = querySnapshot.docs.map((doc) => {
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
        setHackathons(activeHackathons);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching active hackathons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveHackathons();
  }, []);

  return (
    <div
      className="flex justify-center items-center w-full"
      id="hackathons-list"
    >
      <Container className="flex-col gap-8 lg:gap-16">
        <div className="flex flex-col text-center">
          <h1 className="text-3xl lg:text-5xl font-bold">Hackathons</h1>
          <p className="text-sm lg:text-lg">
            Discover and participate in exciting hackathons
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 w-full">
          {loading ? (
            <div className="col-span-1 lg:col-span-3 flex justify-center items-center w-full p-4">
              <PiSpinnerBold className="animate-spin text-2xl lg:text-4xl" />
            </div>
          ) : (
            hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="border rounded-md bg-white/5 drop-shadow-md hover:bg-white/10 p-4 transition-all duration-500"
              >
                <div>
                  <p className="text-lg lg:text-2xl font-bold">
                    {hackathon.title}
                  </p>
                  <p className="mt-2 text-sm lg:text-base">
                    {hackathon.description}
                  </p>
                  <div className="flex justify-between gap-2 mt-4 text-xs lg:text-base">
                    <p className="px-3 lg:px-4 py-2 rounded-md bg-green-900">
                      Start: {formatDate(hackathon.startDate) || ""}
                    </p>
                    <p className="px-3 lg:px-4 py-2 rounded-md bg-red-900">
                      End: {formatDate(hackathon.endDate) || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}
