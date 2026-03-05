import api from "@/shared/lib/api/client";
import { uploadFile } from "@/shared/lib/api/uploadFile";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GroupUpdateData, GroupUpdateResponse } from "./types";

interface UpdateGroupParams {
  groupId: number;
  groupData: GroupUpdateData;
  thumbnailFile?: File | null;
}

export const updateGroup = async ({
  groupId,
  groupData,
  thumbnailFile,
}: UpdateGroupParams): Promise<GroupUpdateResponse> => {
  const thumbNailUrl = thumbnailFile
    ? await uploadFile(thumbnailFile)
    : groupData.thumbNailUrl;

  const requestBody: GroupUpdateData = {
    name: groupData.name,
    description: groupData.description,
    memberLimit: groupData.memberLimit,
    groupKind: groupData.groupKind,
    thumbNailUrl,
  };

  const { data } = await api.patch<GroupUpdateResponse>(
    REQUEST_PATHS.GROUPS.DETAIL(groupId),
    requestBody
  );

  return data;
};
