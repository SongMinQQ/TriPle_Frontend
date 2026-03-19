export const USER_GENDERS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;

export type UserGender = (typeof USER_GENDERS)[keyof typeof USER_GENDERS];

export const normalizeUserGender = (
  gender?: string | null
): UserGender | "" => {
  const normalizedGender = gender?.toUpperCase();

  if (
    normalizedGender === USER_GENDERS.MALE ||
    normalizedGender === USER_GENDERS.FEMALE
  ) {
    return normalizedGender;
  }

  return "";
};
