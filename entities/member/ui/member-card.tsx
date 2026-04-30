import type { ReactNode } from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import type { Member } from "@/entities/group/model/types";
import { PLACEHOLDERS } from "@/shared/constants/constants";

interface MemberCardProps {
  member: Member;
  action?: ReactNode;
  profileImageSize?: number;
}

export function MemberCard({
  member,
  action,
  profileImageSize = 48,
}: MemberCardProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={member.avatar || PLACEHOLDERS.PROFILE_AVATAR}
        alt={member.name}
        width={profileImageSize}
        height={profileImageSize}
        style={{
          width: profileImageSize,
          height: profileImageSize,
        }}
        className="shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">{member.name}</span>
          {member.isLeader ? <Crown className="h-4 w-4 text-[#f4a261]" /> : null}
        </div>
        <p className="mt-0.5 truncate text-xs leading-relaxed text-muted-foreground">
          {member.bio}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
