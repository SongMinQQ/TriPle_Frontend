export const REQUEST_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  FILES: {
    UPLOAD_PRESIGN: "/files/upload-presign",
    UPLOAD_COMPLETE: "/files/upload-complete",
  },
  GROUPS: {
    LIST: "/groups",
    DETAIL: (groupId: number) => `/groups/${groupId}`,
    MENU: (groupId: number) => `/groups/${groupId}/menu`,
  },
  USERS: {
    ME: "/users/me",
  },
} as const;
