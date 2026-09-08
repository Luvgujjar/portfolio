"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Cursor = { index: number; len: number; deleting: boolean };

const HOLD = 1900;
const TYPE = 62;
const ERASE = 32;
const PAUSE = 280;

/** Advances the typewriter by exactly one step. */
function step(cursor: Cursor, roles: string[]): Cursor {
  const word = roles[cursor.index];
  if (!cursor.deleting && cursor.len === word.length) {
    return { ...cursor, deleting: true };
  }
  if (cursor.deleting && cursor.len === 0) {
    return { index: (cursor.index + 1) % roles.length, len: 0, deleting: false };
  }
  return { ...cursor, len: cursor.len + (cursor.deleting ? -1 : 1) };
}

/**
 * Types the roles from the CV one character at a time, holds, then deletes.
 * A continuous flourish that costs one timer and no layout thrash.
 */
export default function RoleCycler({ roles }: { roles: string[] }) {
  const reduced = usePrefersReducedMotion();
  const [cursor, setCursor] = useState<Cursor>({
    index: 0,
    len: 0,
    deleting: false,
  });

  const { index, len, deleting } = cursor;

  useEffect(() => {
    if (reduced) return;

    const word = roles[index];
    const delay =
      !deleting && len === word.length
        ? HOLD
        : deleting && len === 0
          ? PAUSE
          : deleting
            ? ERASE
            : TYPE;

    const timer = setTimeout(() => setCursor((c) => step(c, roles)), delay);
    return () => clearTimeout(timer);
  }, [reduced, roles, index, len, deleting]);

  // Reduced motion gets the full list at once rather than a frozen fragment.
  const text = reduced ? roles.join(" · ") : roles[index].slice(0, len);

  return (
    <p className="font-mono text-sm tracking-tight text-paper sm:text-base">
      {text}
      {!reduced && (
        <span
          aria-hidden
          className="animate-caret ml-0.5 inline-block w-[1px] bg-accent align-middle text-transparent"
        >
          |
        </span>
      )}
    </p>
  );
}
