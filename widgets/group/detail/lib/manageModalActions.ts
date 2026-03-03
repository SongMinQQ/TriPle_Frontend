// 게스트일 경우에는 가입 신청 멤버일 경우에는 그룹 탈퇴

import { joinGroup } from "@/entities/group/model/api/joinGroup"
import { toast } from "@/shared/hooks/use-toast";

export const groupJoinRequest = async(groupId: number) => {
  try{
    const response = await joinGroup(groupId);
    toast({
      variant: "default",
      title: "그룹 가입 신청 완료",
      description: "그룹 가입 신청이 완료되었습니다."
    })
    return response;
  }
  catch(err){
    return err;
  }
}
// 그룹장일 경우에는 그룹 관리
// 그룹 관리에선 그룹 수정, 그룹 가입 신청 관리, 그룹 소유권 이전 중 선택할 수 있는 modal