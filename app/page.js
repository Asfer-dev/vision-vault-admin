"use client";

import { useSession } from "next-auth/react";
import PageLayout from "./PageLayout";

export default function Home() {
  const { data: session } = useSession();
  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <h2 className="text-xl">Welcome, {session?.user.name}</h2>
        <div className="flex gap-3 items-center rounded-full roundedr-sm bg-accent/20 p-2 pr-3">
          <button>
            <img
              className="w-10 h-10 rounded-full outline outline-accent"
              src={session?.user.image}
              alt="account-avatar"
            />
          </button>
          <p>{session?.user.name}</p>
        </div>
      </div>
    </PageLayout>
  );
}
