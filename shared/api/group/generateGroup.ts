import api from "@/shared/api/common";
import { uploadFile } from "@/shared/api/file/uploadFile";
import { REQUEST_PATHS } from "@/shared/constants/paths";
import type { GroupGenerateData, GroupGenerateResponse } from "./types";

interface GenerateGroupParams {
  groupData: GroupGenerateData;
  thumbnailFile?: File | null;
}

interface GroupGenerateRequest {
  name: string;
  description: string;
  memberLimit: number;
  groupKind: string;
  thumbNailUrl: string;
}

/**
 * Create a new group.
 *
 * If `thumbnailFile` is provided, this function uploads the image through
 * the common file API and then uses the uploaded key for `thumbNailUrl`.
 */
export const generateGroup = async ({
  groupData,
  thumbnailFile,
}: GenerateGroupParams): Promise<GroupGenerateResponse> => {
  const thumbNailUrl = thumbnailFile ? await uploadFile(thumbnailFile) : groupData.thumbNailUrl;

  const requestBody: GroupGenerateRequest = {
    name: groupData.name,
    description: groupData.description,
    memberLimit: groupData.memberLimit,
    groupKind: groupData.groupKind,
    thumbNailUrl,
  };

  const { data } = await api.post<GroupGenerateResponse>(REQUEST_PATHS.GROUPS.LIST, requestBody);
  return data;
};
