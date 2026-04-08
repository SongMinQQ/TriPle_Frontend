import { create } from "zustand";
import type { UserProfile } from "@/entities/user/model/types";

export type CurrentUserStatus = "pending" | "authenticated" | "unauthenticated";

interface CurrentUserState {
  currentUser: UserProfile | null;
  status: CurrentUserStatus;
  setPending: () => void;
  setAuthenticatedUser: (user: UserProfile) => void;
  setUnauthenticated: () => void;
}

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
  currentUser: null,
  status: "pending",
  setPending: () =>
    set({
      status: "pending",
    }),
  setAuthenticatedUser: (user) =>
    set({
      currentUser: user,
      status: "authenticated",
    }),
  setUnauthenticated: () =>
    set({
      currentUser: null,
      status: "unauthenticated",
    }),
}));
