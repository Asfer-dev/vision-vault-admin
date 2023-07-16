"use client";

import Image from "next/image";
import imgLogo from "../public/assets/logo.png";
import Nav from "@components/Nav";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { IconClose, IconHamburger } from "@lib/icons";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function PageLayout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  // const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return !session ? (
    <main className="min-h-screen bg-accent">
      <div className="flex flex-col gap-8 items-center justify-center h-screen w-screen">
        <h1 className="text-5xl text-center">
          <div className="font-logo logo uppercase flex flex-col sm:flex-row gap-4 justify-center items-center mb-4 text-red-700">
            <Image
              className="rounded-sm"
              src={imgLogo}
              width={100}
              height={100}
            />
            Vision Vault
          </div>{" "}
          Admin
        </h1>
        {loading ? (
          <ClipLoader color="#fff" />
        ) : (
          <button
            onClick={() => signIn("google")}
            className="text-2xl font-medium shadow-spread transition bg-white px-12 py-3 rounded-sm"
          >
            Log In
          </button>
        )}
      </div>
    </main>
  ) : (
    <main className="min-h-screen">
      <div className="flex flex-grow justify-between p-4 md:hidden">
        <Link href={"/"} className="flex items-center gap-1">
          <Image src={imgLogo} width={40} height={40} />
          <h1 className="font-logo uppercase font-medium">Vision Vault</h1>
        </Link>
        <button onClick={() => setShowNav((prev) => !prev)}>
          {showNav ? <IconClose /> : <IconHamburger />}
        </button>
      </div>
      <div className="flex">
        <Nav showNav={showNav} />
        <div className="flex-grow rounded-sm p-4 md:p-8 my-2 mr-2">
          {children}
        </div>
      </div>
    </main>
  );
}
