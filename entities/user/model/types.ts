import type { UserGender } from "@/entities/user/model/gender";

export interface UserProfile {
  id: string;
  nickname: string;
  gender: UserGender | "";
  birth: string;
  description: string;
  profileUrl: string;
}
