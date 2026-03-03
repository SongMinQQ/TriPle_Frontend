import api from "@/shared/lib/api/client";
import { uploadFile } from "@/shared/lib/api/uploadFile";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GroupGenerateData, GroupGenerateResponse } from "./types";

interface GenerateGroupParams {
  groupData: GroupGenerateData;
  thumbnailFile?: File | null;
}

export const generateGroup = async ({
  groupData,
  thumbnailFile,
}: GenerateGroupParams): Promise<GroupGenerateResponse> => {
  const thumbNailUrl = thumbnailFile ? await uploadFile(thumbnailFile) : groupData.thumbNailUrl;

  const requestBody: GroupGenerateData = {
    name: groupData.name,
    description: groupData.description,
    memberLimit: groupData.memberLimit,
    groupKind: groupData.groupKind,
    thumbNailUrl,
  };

  const { data } = await api.post<GroupGenerateResponse>(REQUEST_PATHS.GROUPS.LIST, requestBody);
  return data;
};
