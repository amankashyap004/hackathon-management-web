"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "../wrappers/Container";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function HackathonList() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    setHackathons(dummyHackathons);
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
          <Link
            href={`/hackathons/${hackathon.id}`}
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
          </Link>
        ))}
      </div>
    </Container>
  );
}

const dummyHackathons: Hackathon[] = [
  {
    id: "1",
    title: "AI Innovation Hackathon",
    description:
      "Discover cutting-edge AI solutions and push the boundaries of technology.",
    startDate: "2023-07-01",
    endDate: "2023-07-03",
  },
  {
    id: "2",
    title: "Web3 Blockchain Challenge",
    description:
      "Build decentralized applications and explore blockchain technology.",
    startDate: "2023-08-15",
    endDate: "2023-08-17",
  },
  {
    id: "3",
    title: "Tech Sustainability Hack",
    description: "Create sustainable solutions for a better tomorrow.",
    startDate: "2023-09-10",
    endDate: "2023-09-12",
  },
  {
    id: "4",
    title: "Gaming Revolution Hackathon",
    description: "Revolutionize the gaming industry with innovative ideas.",
    startDate: "2023-10-20",
    endDate: "2023-10-22",
  },
  {
    id: "5",
    title: "Health Tech Hack",
    description: "Develop cutting-edge solutions for the healthcare industry.",
    startDate: "2023-11-05",
    endDate: "2023-11-07",
  },
  {
    id: "6",
    title: "FinTech Future Challenge",
    description: "Innovate in the financial technology space.",
    startDate: "2023-12-01",
    endDate: "2023-12-03",
  },
];
