"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/entities/user/model/api/getMyProfile";
import type { UserProfile } from "@/entities/user/model/types";
import { USER_QUERY_KEYS } from "@/entities/user/queries/user.query-keys";

export const useMyProfileQuery = () =>
  useQuery<UserProfile>({
    queryKey: USER_QUERY_KEYS.me(),
    queryFn: getMyProfile,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
