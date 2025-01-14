export interface Hackathon {
  creatorId?: string;
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  rules?: string;
  prizes?: string;
  participantCount?: number;
  participants?: string[];
  status?: "active" | "upcoming" | "past";
  bannerUrl?: string;
}
