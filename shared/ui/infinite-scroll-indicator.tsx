import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface InfiniteScrollIndicatorProps {
  visible?: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  className?: string;
}

const InfiniteScrollIndicator = ({
  visible = true,
  isFetchingNextPage,
  hasNextPage,
  className,
}: InfiniteScrollIndicatorProps) => {
  if (!visible) {
    return null;
  }

  if (isFetchingNextPage) {
    return (
      <div className={cn("mt-4 flex items-center justify-center text-muted-foreground", className)}>
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
      </div>
    );
  }

  if (hasNextPage) {
    return (
      <div className={cn("mt-4 flex items-center justify-center text-muted-foreground", className)}>
        <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
      </div>
    );
  }

  return null;
};

export default InfiniteScrollIndicator;
