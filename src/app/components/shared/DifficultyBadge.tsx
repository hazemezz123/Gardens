import { Sprout } from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-800",
  Intermediate: "bg-amber-100 text-amber-800",
  Advanced: "bg-rose-100 text-rose-800",
};

export function DifficultyBadge({ level }: { level: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[level] || "bg-gray-100 text-gray-700"}`}>
      <Sprout size={11} /> {level}
    </span>
  );
}
