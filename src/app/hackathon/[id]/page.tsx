"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
// prettier-ignore
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuthContext } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import Layout from "@/components/wrappers/Layout";
import Container from "@/components/wrappers/Container";
import Button from "@/components/ui/Button";
import { Hackathon } from "@/types";
import { PiSpinnerBold } from "react-icons/pi";

export default function HackathonDetails() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const router = useRouter();
  // prettier-ignore
  const [hackathon, setHackathon] = useState<Hackathon | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHackathonDetails();
  }, [id]);

  const fetchHackathonDetails = async () => {
    try {
      const hackathonDoc = await getDoc(
        doc(db, "hackathon-management-1", id as string)
      );
      if (hackathonDoc.exists()) {
        setHackathon({
          id: hackathonDoc.id,
          ...hackathonDoc.data(),
        } as Hackathon);
      } else {
        setError("Hackathon not found");
      }
    } catch (error) {
      setError("Failed to fetch hackathon details");
      console.error("Error fetching hackathon details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!hackathon) return;

    const hackathonRef = doc(db, "hackathon-management-1", hackathon.id);
    const isParticipant = hackathon?.participants?.includes(user.uid);

    try {
      if (isParticipant) {
        await updateDoc(hackathonRef, {
          participants: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(hackathonRef, {
          participants: arrayUnion(user.uid),
        });
      }
      fetchHackathonDetails();
    } catch (error) {
      setError("Failed to update participation");
      console.error("Error updating participation:", error);
    }
  };

  if (error || !hackathon) {
    return (
      <Layout>
        <Container>
          <div className="flex justify-center items-center w-full min-h-screen">
            {error}
          </div>
        </Container>
      </Layout>
    );
  }

  const isParticipant = user && hackathon?.participants?.includes(user.uid);

  return (
    <Layout>
      <Container className="mt-16">
        {loading ? (
          <div className="flex justify-center items-center w-full min-h-screen">
            <PiSpinnerBold className="animate-spin text-2xl lg:text-4xl" />
          </div>
        ) : (
          <div className="py-8 min-h-screen">
            <h1 className="text-xl lg:text-3xl font-bold mb-6">
              {hackathon.title}
            </h1>

            {/* <Image
            src={hackathon.bannerUrl}
            alt={hackathon.title}
            width={400}
            height={200}
            quality={100}
            className="w-full object-cover rounded-lg mb-6"
          /> */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <section className="md:col-span-2">
                <div className="mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-2xl font-bold mb-2">
                    Description
                  </h2>
                  <p>{hackathon.description}</p>
                </div>

                <div className="mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-2xl font-bold mb-2">Rules</h2>
                  <p>{hackathon.rules}</p>
                </div>

                <div className="mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-2xl font-bold mb-2">Prizes</h2>
                  <p>{hackathon.prizes}</p>
                </div>
              </section>

              <section>
                <div className="mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-2xl font-bold mb-2">
                    Details
                  </h2>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(hackathon.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(hackathon.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Registration Deadline:</strong>{" "}
                    {new Date(
                      hackathon.registrationDeadline || ""
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {hackathon.status}
                  </p>
                  <p>
                    <strong>Participants:</strong>{" "}
                    {hackathon?.participants?.length}
                  </p>
                </div>
                <Button
                  onClick={handleJoinLeave}
                  className={`w-full ${
                    isParticipant
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  {user
                    ? isParticipant
                      ? "Leave Hackathon"
                      : "Join Hackathon"
                    : "Login to Join Hackathon"}
                </Button>
              </section>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
}
