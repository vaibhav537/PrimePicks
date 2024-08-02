import React from "react";
import Image from "next/image";
import { JwtPayload } from "jsonwebtoken";

const Home = (data: JwtPayload) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello
    </main>
  );
};

export default Home;
