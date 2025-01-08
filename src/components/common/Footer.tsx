import React from "react";
import Container from "../wrappers/Container";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-800 ">
      <Container>
        <div className="py-4 text-center text-sm ">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
