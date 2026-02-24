export const GROUP_NAME_MAX_LENGTH = 15;
export const GROUP_DESCRIPTION_MAX_LENGTH = 300;
export const GROUP_MEMBER_MIN_LIMIT = 2;
export const GROUP_MEMBER_MAX_LIMIT = 20;
export const GROUP_MEMBER_DEFAULT_LIMIT = 6;

export interface GroupGenerateRequiredFormState {
  groupName: string;
  description: string;
  maxMembers: number;
  isPublic: boolean;
}

export interface GroupGenerateOptionalFormState {
  thumbnailFile: File | null;
}
