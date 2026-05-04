import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
  onClick: () => void;
  delay?: number;
}

export function CategoryCard({
  icon: Icon,
  title,
  description,
  colorClass,
  bgClass,
  onClick,
  delay = 0,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300",
        "hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]",
        bgClass,
        "shadow-card hover:shadow-lg",
        "animate-fade-in opacity-0"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl mb-4 transition-transform group-hover:scale-110",
          colorClass,
          "bg-card shadow-soft"
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </button>
  );
}
