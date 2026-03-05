import type { GroupMemberDto } from "@/entities/group/model/api/types";
import { KickMemberButton } from "@/features/group/members/ui/actions/KickMemberButton";
import { TransferOwnerButton } from "@/features/group/members/ui/actions/TransferOwnerButton";

interface MemberManageActionButtonsProps {
  member: GroupMemberDto;
  disabled: boolean;
  onKick: (member: GroupMemberDto) => void;
  onTransferOwner: (member: GroupMemberDto) => void;
}

export function MemberManageActionButtons({
  member,
  disabled,
  onKick,
  onTransferOwner,
}: MemberManageActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <TransferOwnerButton
        onClick={() => onTransferOwner(member)}
        disabled={disabled}
      />
      <KickMemberButton onClick={() => onKick(member)} disabled={disabled} />
    </div>
  );
}
