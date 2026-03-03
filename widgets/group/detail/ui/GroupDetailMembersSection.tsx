import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Group } from "@/entities/group/model/types"
import { MemberCard } from "@/entities/member/ui/member-card"
import { GroupDetailSectionHeader } from "@/widgets/group/detail/ui/GroupDetailSectionHeader"

interface GroupDetailMembersSectionProps {
  group: Group
}

export function GroupDetailMembersSection({ group }: GroupDetailMembersSectionProps) {
  return (
    <section>
      <GroupDetailSectionHeader
        title="멤버"
        count={group.currentMemberCount}
        href={`/group/${group.id}/members`}
        moreLinkClassName="hidden lg:flex"
      />
      <div className="mt-4 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
        {group.members.slice(0, 2).map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
        <div className="hidden lg:contents">
          {group.members.slice(2, 4).map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
      <Link
        href={`/group/${group.id}/members`}
        className="mt-4 flex items-center justify-center gap-1 rounded-lg bg-muted py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 lg:hidden"
      >
        더보기
        <ChevronRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
