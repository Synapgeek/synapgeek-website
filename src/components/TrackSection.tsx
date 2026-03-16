"use client";

import { useTrackView } from "@/hooks/useTrackView";

export function TrackSection({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const ref = useTrackView(name);
  return <div ref={ref}>{children}</div>;
}
