import Image from "next/image"
import { Crown } from "lucide-react"
import type { Member } from "@/entities/group/model/mock-data"
import { PLACEHOLDERS } from "@/shared/constants/constants"

interface MemberCardProps {
  member: Member
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={member.avatar || PLACEHOLDERS.PROFILE_AVATAR}
        alt={member.name}
        width={48}
        height={48}
        className="rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">{member.name}</span>
          {member.isLeader && <Crown className="h-4 w-4 text-[#f4a261]" />}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground leading-relaxed">
          {member.bio}
        </p>
      </div>
    </div>
  )
}


