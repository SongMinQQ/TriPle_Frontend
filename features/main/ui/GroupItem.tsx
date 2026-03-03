"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PublicGroupListItemDto } from "@/entities/group/model/api/types";

const DESCRIPTION_PREVIEW_LENGTH = 120;

interface GroupItemProps {
  group: PublicGroupListItemDto;
}

const GroupItem = ({ group }: GroupItemProps) => {
  const { groupId, name, description, currentMemberCount, memberLimit, thumbNailUrl } = group;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const isLongDescription = description.length > DESCRIPTION_PREVIEW_LENGTH;
  const displayDescription =
    isLongDescription && !isDescriptionExpanded
      ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}...`
      : description;

  return (
    <div className="flex items-center gap-5 rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-md">
      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl">
        <Image
          src={thumbNailUrl || "/placeholder.svg"}
          alt={name}
          fill
          sizes="100px"
          unoptimized
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold text-foreground">{name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{displayDescription}</p>
        {isLongDescription ? (
          <button
            type="button"
            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
            className="mt-1 text-xs font-medium text-primary transition-opacity hover:opacity-80"
          >
            {isDescriptionExpanded ? "\uc811\uae30" : "... \ub354\ubcf4\uae30"}
          </button>
        ) : null}
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>
            {currentMemberCount}/{memberLimit}
          </span>
        </div>
      </div>
      <Link
        href={`/group/${groupId}`}
        className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        자세히 보기
      </Link>
    </div>
  );
};

export default GroupItem;
