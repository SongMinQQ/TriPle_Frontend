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
  },
  USERS: {
    ME: "/users/me",
  },
} as const;
