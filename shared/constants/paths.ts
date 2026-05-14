export const REQUEST_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
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
    REJECT_JOIN_APPLY: (groupId: number, joinApplyId: number) =>
      `/groups/${groupId}/join-applies/${joinApplyId}/reject`,
    LEAVE: (groupId: number) => `/groups/${groupId}/users/me`,
  },
  TRAVELS: {
    CREATE: "/travels",
    LIST: (groupId: number) => `/travels/${groupId}`,
    DETAIL_INFO: (travelId: number) => `/travels/${travelId}/info`,
    TRANSFER: (travelId: number) => `/travels/${travelId}/transfer`,
    ADD_MEMBER: (travelId: number) => `/travels/${travelId}/user`,
    LEAVE: (travelId: number) => `/travels/${travelId}/users/me`,
    SECONDARY_TOKEN: (travelId: number) => `/travels/${travelId}/secondary-token`,
  },
  USERS: {
    ROOT: "/users",
    ME: "/users/me",
    DETAIL: (userId: string) => `/users/${encodeURIComponent(userId)}`,
  },
} as const;
