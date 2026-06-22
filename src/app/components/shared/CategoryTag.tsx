export function CategoryTag({ cat }: { cat: string }) {
  return (
    <span className="inline-flex items-center text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{cat}</span>
  );
}
