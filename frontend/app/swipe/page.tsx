"use client";

import { SwipeDeck } from "@/components/swipe/SwipeDeck";
import { useProtected } from "@/hooks/useProtected";

export default function SwipePage() {
  const { loading } = useProtected(["JOB_SEEKER"]);
  if (loading) return null;
  return <SwipeDeck />;
}
