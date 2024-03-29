"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import React from "react";

const GithubButton = () => {
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button onClick={handleSignIn} className="hover:bg-gray-700 p-8 rounded-md">
      <Image
        src={"/github-mark-white.png"}
        alt="github logo"
        width={100}
        height={100}
      />
    </button>
  );
};

export default GithubButton;
