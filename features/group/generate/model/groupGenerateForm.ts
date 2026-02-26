export interface GroupGenerateRequiredFormState {
  groupName: string;
  description: string;
  maxMembers: number;
  isPublic: boolean;
}

export interface GroupGenerateOptionalFormState {
  thumbnailFile: File | null;
}
