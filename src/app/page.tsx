import Layout from "@/components/wrappers/Layout";
import Hero from "@/components/home/Hero";
import HackathonList from "@/components/home/HackathonList";

export default function Home() {
  return (
    <Layout>
      <main>
        <Hero />
        <HackathonList />
      </main>
    </Layout>
  );
}
