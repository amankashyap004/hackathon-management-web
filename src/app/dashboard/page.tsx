"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchHackathonsData } from "@/utils/hackathonUtils";

// Update Hackathon type to reflect actual data structure
interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isParticipant: boolean;
  published: boolean;
  status: string;
}

// Define Stats type
interface Stats {
  totalHackathons: number;
  activeHackathons: number;
  upcomingHackathons: number;
  pastHackathons: number;
  publishedHackathons: number;
  unpublishedHackathons: number;
}

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [stats, setStats] = useState<Stats>({
    totalHackathons: 0,
    activeHackathons: 0,
    upcomingHackathons: 0,
    pastHackathons: 0,
    publishedHackathons: 0,
    unpublishedHackathons: 0,
  });

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user?.uid) return;

    // Fetch and map the data to match the Hackathon type
    const data = await fetchHackathonsData(user.uid);
    const hackathons: Hackathon[] = data.map((item: Partial<Hackathon>) => ({
      id: item.id || "",
      title: item.title || "Untitled",
      description: item.description || "No description available",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      isParticipant: item.isParticipant || false,
      published: item.published || false,
      status: item.status || "inactive",
    }));

    const now = new Date();

    // prettier-ignore
    const activeHackathons = hackathons.filter((h) => new Date(h.startDate) <= now && new Date(h.endDate) >= now && h.status === "active");
    // prettier-ignore
    const upcomingHackathons = hackathons.filter((h) => new Date(h.startDate) > now);
    const pastHackathons = hackathons.filter((h) => new Date(h.endDate) < now);
    const publishedHackathons = hackathons.filter((h) => h.published);
    const unpublishedHackathons = hackathons.filter((h) => !h.published);

    setStats({
      totalHackathons: hackathons.length,
      activeHackathons: activeHackathons.length,
      upcomingHackathons: upcomingHackathons.length,
      pastHackathons: pastHackathons.length,
      publishedHackathons: publishedHackathons.length,
      unpublishedHackathons: unpublishedHackathons.length,
    });
  };

  if (!user) {
    return <p>Please log in to view the dashboard.</p>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        <div className="p-4 bg-blue-900 rounded w-full">
          <h3 className="font-semibold">Total Hackathons</h3>
          <p>{stats.totalHackathons}</p>
        </div>
        <div className="p-4 bg-pink-900 rounded w-full">
          <h3 className="font-semibold">Active Hackathons</h3>
          <p>{stats.activeHackathons}</p>
        </div>
        <div className="p-4 bg-green-900 rounded">
          <h3 className="font-semibold">Upcoming Hackathons</h3>
          <p>{stats.upcomingHackathons}</p>
        </div>
        <div className="p-4 bg-red-900 rounded">
          <h3 className="font-semibold">Past Hackathons</h3>
          <p>{stats.pastHackathons}</p>
        </div>
        <div className="p-4 bg-yellow-900 rounded w-full">
          <h3 className="font-semibold">Published Hackathons</h3>
          <p>{stats.publishedHackathons}</p>
        </div>
        <div className="p-4 bg-orange-900 rounded w-full">
          <h3 className="font-semibold">Unpublished Hackathons</h3>
          <p>{stats.unpublishedHackathons}</p>
        </div>
      </div>
    </div>
  );
}
