"use client";

import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

type AuthButtonsProps = {
  isAuthenticated: boolean;
};

export default function AuthButtons({ isAuthenticated }: AuthButtonsProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link className="rounded border border-black/20 px-3 py-1 text-sm" href="/register">
          Register
        </Link>
        <button
          className="rounded bg-black px-3 py-1 text-sm text-white"
          onClick={() => signIn()}
          type="button"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <button className="rounded bg-black px-3 py-1 text-sm text-white" onClick={() => signOut()} type="button">
      Logout
    </button>
  );
}
