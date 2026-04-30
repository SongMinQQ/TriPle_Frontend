import type { GroupMemberDto } from "@/entities/group/model/api/types";
import type { UserProfile } from "@/entities/user/model/types";

export const normalizeScheduleMemberIdentityValue = (
  value: string | null | undefined
): string => value?.trim().toLowerCase() ?? "";

export const hasSameGroupMemberIdentity = (
  left: GroupMemberDto,
  right: GroupMemberDto
): boolean => {
  const leftId = normalizeScheduleMemberIdentityValue(left.id);
  const rightId = normalizeScheduleMemberIdentityValue(right.id);

  if (leftId && leftId === rightId) {
    return true;
  }

  const leftName = normalizeScheduleMemberIdentityValue(left.name);
  const rightName = normalizeScheduleMemberIdentityValue(right.name);

  if (!leftName || leftName !== rightName) {
    return false;
  }

  const leftProfileUrl = normalizeScheduleMemberIdentityValue(left.profileUrl);
  const rightProfileUrl = normalizeScheduleMemberIdentityValue(right.profileUrl);

  if (leftProfileUrl && leftProfileUrl === rightProfileUrl) {
    return true;
  }

  const leftDescription = normalizeScheduleMemberIdentityValue(left.description);
  const rightDescription = normalizeScheduleMemberIdentityValue(right.description);

  return Boolean(leftDescription && leftDescription === rightDescription);
};

export const createCurrentUserGroupMember = (
  currentUser: UserProfile
): GroupMemberDto => ({
  id: currentUser.id,
  name: currentUser.nickname,
  description: currentUser.description,
  profileUrl: currentUser.profileUrl,
  isOwner: false,
});

export const getDistinctGroupMembers = (
  members: GroupMemberDto[]
): GroupMemberDto[] =>
  members.filter(
    (candidate, candidateIndex, allMembers) =>
      allMembers.findIndex((member) =>
        hasSameGroupMemberIdentity(member, candidate)
      ) === candidateIndex
  );

export const findCurrentUserGroupMember = (
  members: GroupMemberDto[],
  currentUser: UserProfile | undefined
): GroupMemberDto | null => {
  if (!currentUser?.id) {
    return null;
  }

  const currentUserMember = createCurrentUserGroupMember(currentUser);

  return (
    members.find((member) =>
      hasSameGroupMemberIdentity(member, currentUserMember)
    ) ?? null
  );
};

export const mergeCurrentUserWithGroupMembers = ({
  fetchedMembers,
  currentUser,
}: {
  fetchedMembers: GroupMemberDto[];
  currentUser: UserProfile | undefined;
}): GroupMemberDto[] => {
  const distinctFetchedMembers = getDistinctGroupMembers(fetchedMembers);

  if (!currentUser?.id) {
    return distinctFetchedMembers;
  }

  if (findCurrentUserGroupMember(distinctFetchedMembers, currentUser)) {
    return distinctFetchedMembers;
  }

  return [createCurrentUserGroupMember(currentUser), ...distinctFetchedMembers];
};
