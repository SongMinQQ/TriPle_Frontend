import { ChevronRight, CircleDollarSign, MapPin } from "lucide-react";

const ProfileMenuSection = () => {
  return (
    <div className="mt-10 flex flex-col gap-3">
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl bg-muted/60 px-5 py-4 transition-colors hover:bg-muted"
        >
          <CircleDollarSign className="h-5 w-5 text-primary" />
          <span className="flex-1 text-left text-sm font-medium text-foreground">{"송금 내역"}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl bg-muted/60 px-5 py-4 transition-colors hover:bg-muted"
        >
          <MapPin className="h-5 w-5 text-primary" />
          <span className="flex-1 text-left text-sm font-medium text-foreground">{"내 여행 기록"}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
  );
};

export default ProfileMenuSection;