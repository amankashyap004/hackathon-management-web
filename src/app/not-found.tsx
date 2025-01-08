import React from "react";
import Link from "next/link";
import Container from "@/components/wrappers/Container";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Container className="flex-col text-center">
        <h1 className="text-5xl lg:text-6xl font-bold mb-4">404</h1>
        <p className="lg:text-xl mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 lg:py-3 text-white rounded-lg bg-orange-600 hover:bg-orange-700 transition duration-300"
        >
          Go Back Home
        </Link>
      </Container>
    </div>
  );
};

export default NotFound;
