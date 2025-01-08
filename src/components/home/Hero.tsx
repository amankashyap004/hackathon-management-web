import React from "react";
import Link from "next/link";
import Container from "../wrappers/Container";
import Button from "../ui/Button";

const Hero = () => {
  return (
    <section className="flex justify-center items-center w-full h-screen">
      <Container>
        <div className="flex flex-col justify-center items-center gap-4 lg:w-1/2 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold ">
            <span className="leading-tight">
              Manage Hackathons Effortlessly
            </span>
          </h1>
          <p className="text-sm lg:text-lg">
            Discover, create, and participate in hackathon events with ease.
            Streamline your hackathon experience and unlock innovation.
          </p>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-4 w-full mt-4 lg:mt-8">
            <Link href="/" className="w-full lg:w-auto">
              <Button>Discover Hackathons</Button>
            </Link>
            <Link href="/" className="w-full lg:w-auto">
              <Button variant="secondary">Create Hackathon</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
