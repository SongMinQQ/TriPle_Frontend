import { cookies } from "next/headers";
import type { GetGroupMembersResponse, GroupMemberDto } from "@/entities/group/model/api/types";
import type { GetMyProfileResponse } from "@/features/auth/api/types";
import { REQUEST_PATHS } from "@/shared/constants/paths";

interface ScheduleCreateInitialData {
  members: GroupMemberDto[];
  requiredMemberId: string | null;
}

const fetchWithSession = async (
  path: string,
  cookieHeader?: string
): Promise<Response> => {
  const serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

  if (!serverAddress) {
    throw new Error("NEXT_PUBLIC_SERVER_ADDRESS is not configured.");
  }

  return fetch(`${serverAddress}${path}`, {
    method: "GET",
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
};

const getRequiredMemberId = (
  members: GroupMemberDto[],
  currentUser: GetMyProfileResponse | null
): string | null => {
  if (currentUser?.publicUuid && members.some((member) => member.id === currentUser.publicUuid)) {
    return currentUser.publicUuid;
  }

  return members.length === 1 ? members[0].id : null;
};

export const getScheduleCreateMembers = async (
  groupId: number
): Promise<ScheduleCreateInitialData> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const [membersResponse, currentUserResponse] = await Promise.all([
    fetchWithSession(REQUEST_PATHS.GROUPS.MEMBERS(groupId), cookieHeader),
    fetchWithSession(REQUEST_PATHS.USERS.ME, cookieHeader),
  ]);

  const members =
    membersResponse.ok
      ? ((await membersResponse.json()) as GetGroupMembersResponse).users
      : [];
  const currentUser = currentUserResponse.ok
    ? ((await currentUserResponse.json()) as GetMyProfileResponse)
    : null;
  const currentUserMember =
    currentUser?.publicUuid
      ? {
          id: currentUser.publicUuid,
          name: currentUser.nickname,
          description: currentUser.description,
          profileUrl: currentUser.profileUrl,
          isOwner: false,
        }
      : null;
  const normalizedMembers =
    currentUserMember && !members.some((member) => member.id === currentUserMember.id)
      ? [currentUserMember, ...members]
      : members;

  return {
    members: normalizedMembers,
    requiredMemberId: getRequiredMemberId(normalizedMembers, currentUser),
  };
};
