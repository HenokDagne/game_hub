"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UndoNavigationButton() {
  const router = useRouter();
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    function syncCanUndo() {
      setCanUndo(window.history.length > 1);
    }

    syncCanUndo();
    window.addEventListener("popstate", syncCanUndo);

    return () => {
      window.removeEventListener("popstate", syncCanUndo);
    };
  }, []);

  function handleUndo() {
    if (!canUndo) {
      return;
    }

    router.back();
  }

  return (
    <button
      aria-label="Go back"
      className="inline-flex h-9 w-9 items-center justify-center rounded border border-black/15 text-sm transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={!canUndo}
      onClick={handleUndo}
      title={canUndo ? "Go back" : "No previous page"}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
