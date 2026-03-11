import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface GroupDetailSectionHeaderProps {
  title: string;
  count: ReactNode;
  href?: string;
  className?: string;
  moreLinkClassName?: string;
}

export function GroupDetailSectionHeader({
  title,
  count,
  href,
  className,
  moreLinkClassName,
}: GroupDetailSectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-xl font-bold text-foreground">
        {title} <span className="text-primary">{count}</span>
      </h2>
      {href ? (
        <Link
          href={href}
          className={cn(
            "flex items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
            moreLinkClassName
          )}
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
