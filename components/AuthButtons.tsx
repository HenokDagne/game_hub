"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type AuthButtonsProps = {
  isAuthenticated: boolean;
};

export default function AuthButtons({ isAuthenticated }: AuthButtonsProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link className="rounded border border-black/20 bg-[var(--surface)] px-3 py-1 text-sm text-[var(--foreground)]" href="/register">
          Register
        </Link>
        <button
          className="rounded border border-black/20 bg-[var(--surface)] px-3 py-1 text-sm text-[var(--foreground)]"
          onClick={() => {
            window.location.href = "/login";
          }}
          type="button"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <button className="rounded border border-black/20 bg-[var(--surface)] px-3 py-1 text-sm text-[var(--foreground)]" onClick={() => signOut()} type="button">
      Logout
    </button>
  );
}
