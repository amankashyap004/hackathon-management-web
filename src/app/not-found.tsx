import React from "react";
import Link from "next/link";
import Container from "@/components/wrappers/Container";
import Button from "@/components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Container className="flex-col text-center">
        <h1 className="text-5xl lg:text-6xl font-bold mb-4">404</h1>
        <p className="lg:text-xl mb-6">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>
      </Container>
    </div>
  );
};

export default NotFound;
