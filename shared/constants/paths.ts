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
    JOIN: (groupId: number) => `/groups/${groupId}/join-applies`,
    LEAVE: (groupId: number) => `/groups/${groupId}/users/me`,
  },
  USERS: {
    ME: "/users/me",
  },
} as const;
