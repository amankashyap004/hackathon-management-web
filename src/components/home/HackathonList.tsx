"use client";

import { useState, useEffect } from "react";
import Container from "../wrappers/Container";
import data from "../../data/data.json";
import { Hackathon } from "@/types";

export default function HackathonList() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    setHackathons(data as Hackathon[]);
  }, []);

  return (
    <Container className="flex-col gap-8 lg:gap-16">
      <div className="flex flex-col text-center">
        <h1 className="text-3xl lg:text-5xl font-bold">Hackathons</h1>
        <p className="text-sm lg:text-lg">
          Discover and participate in exciting hackathons
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 w-full">
        {hackathons.map((hackathon) => (
          <div
            key={hackathon.id}
            className="border rounded-md bg-white/5 drop-shadow-md hover:bg-white/10 p-4 transition-all duration-500"
          >
            <div>
              <p className="text-lg lg:text-2xl font-bold">{hackathon.title}</p>
              <p className="mt-2 text-sm lg:text-base">
                {hackathon.description}
              </p>
              <div className="flex justify-between gap-2 mt-4 text-xs lg:text-base">
                <p className="px-3 lg:px-4 py-2 rounded-md bg-green-900">
                  Start: {hackathon.startDate}
                </p>
                <p className="px-3 lg:px-4 py-2 rounded-md bg-red-900">
                  End: {hackathon.endDate}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
