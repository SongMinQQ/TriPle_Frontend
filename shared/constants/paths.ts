export const REQUEST_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  FILES: {
    UPLOAD_PRESIGN: "/files/upload-presign",
    UPLOAD_COMPLETE: "/files/upload-complete",
  },
  GROUPS: {
    LIST: "/groups",
    ME: "/groups/me",
    DETAIL: (groupId: number) => `/groups/${groupId}`,
    MENU: (groupId: number) => `/groups/${groupId}/menu`,
    MEMBERS: (groupId: number) => `/groups/${groupId}/users`,
    KICK_MEMBER: (groupId: number, targetUserId: string) =>
      `/groups/${groupId}/users/${encodeURIComponent(targetUserId)}`,
    TRANSFER_OWNER: (groupId: number, targetUserId: string) =>
      `/groups/${groupId}/owner/${encodeURIComponent(targetUserId)}`,
    JOIN: (groupId: number) => `/groups/${groupId}/join-applies`,
    JOIN_APPLIES: (groupId: number) => `/groups/${groupId}/join-applies`,
    APPROVE_JOIN_APPLY: (groupId: number, joinApplyId: number) =>
      `/groups/${groupId}/join-applies/${joinApplyId}`,
    LEAVE: (groupId: number) => `/groups/${groupId}/users/me`,
  },
  TRAVELS: {
    CREATE: "/travels",
    LIST: (groupId: number) => `/travels/${groupId}`,
  },
  USERS: {
    ROOT: "/users",
    ME: "/users/me",
    DETAIL: (userId: string) => `/users/${encodeURIComponent(userId)}`,
  },
} as const;
