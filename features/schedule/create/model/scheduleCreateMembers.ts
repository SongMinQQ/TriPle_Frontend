import type { GroupMemberDto } from "@/entities/group/model/api/types";
import type { UserProfile } from "@/entities/user/model/types";

const normalizeIdentityValue = (value: string | null | undefined): string =>
  value?.trim().toLowerCase() ?? "";

const hasSameMemberIdentity = (
  left: GroupMemberDto,
  right: GroupMemberDto
): boolean => {
  const leftId = normalizeIdentityValue(left.id);
  const rightId = normalizeIdentityValue(right.id);

  if (leftId && leftId === rightId) {
    return true;
  }

  const leftName = normalizeIdentityValue(left.name);
  const rightName = normalizeIdentityValue(right.name);

  if (!leftName || leftName !== rightName) {
    return false;
  }

  const leftProfileUrl = normalizeIdentityValue(left.profileUrl);
  const rightProfileUrl = normalizeIdentityValue(right.profileUrl);

  if (leftProfileUrl && leftProfileUrl === rightProfileUrl) {
    return true;
  }

  const leftDescription = normalizeIdentityValue(left.description);
  const rightDescription = normalizeIdentityValue(right.description);

  return Boolean(leftDescription && leftDescription === rightDescription);
};

const createCurrentUserMember = (currentUser: UserProfile): GroupMemberDto => ({
  id: currentUser.id,
  name: currentUser.nickname,
  description: currentUser.description,
  profileUrl: currentUser.profileUrl,
  isOwner: false,
});

export const getDistinctScheduleCreateMembers = (
  members: GroupMemberDto[]
): GroupMemberDto[] =>
  members.filter(
    (candidate, candidateIndex, allMembers) =>
      allMembers.findIndex((member) => hasSameMemberIdentity(member, candidate)) ===
      candidateIndex
  );

export const findCurrentUserScheduleMember = (
  members: GroupMemberDto[],
  currentUser: UserProfile | undefined
): GroupMemberDto | null => {
  if (!currentUser?.id) {
    return null;
  }

  const currentUserMember = createCurrentUserMember(currentUser);

  return (
    members.find((member) => hasSameMemberIdentity(member, currentUserMember)) ?? null
  );
};

export const mergeScheduleCreateMembers = ({
  fetchedMembers,
  currentUser,
}: {
  fetchedMembers: GroupMemberDto[];
  currentUser: UserProfile | undefined;
}): GroupMemberDto[] => {
  const distinctFetchedMembers = getDistinctScheduleCreateMembers(fetchedMembers);

  if (!currentUser?.id) {
    return distinctFetchedMembers;
  }

  if (findCurrentUserScheduleMember(distinctFetchedMembers, currentUser)) {
    return distinctFetchedMembers;
  }

  return [createCurrentUserMember(currentUser), ...distinctFetchedMembers];
};
