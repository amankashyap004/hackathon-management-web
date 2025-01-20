import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchHackathonsData = async (userId?: string) => {
  const hackathonCollection = collection(db, "hackathon-management-1");
  const snapshot = await getDocs(hackathonCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    isParticipant: userId ? doc.data().participants?.includes(userId) : false,
  }));
};
