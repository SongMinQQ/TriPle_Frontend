/**
 * 토스트 자동 닫힘 지연 시간(ms)
 */
export const TOAST_AUTO_DISMISS_DELAY = 5000;

/**
 * 토스트 제거 지연 시간(ms)
 */
export const TOAST_REMOVE_DELAY = 400;

/**
 * 도메인별 토스트 메시지 사전.
 */
export const TOAST_MESSAGES = {
  /**
   * 인증(Auth) 도메인 메시지.
   */
  AUTH: {
    /**
     * 카카오 로그인 성공.
     */
    LOGIN_SUCCESS: {
      title: "로그인 완료",
      description: "로그인에 성공했습니다.",
    },
    /**
     * 카카오 로그인 실패.
     */
    LOGIN_FAILURE: {
      title: "로그인 실패",
      description: "잠시 후 다시 시도해 주세요.",
    },
    /**
     * 세션 만료 안내.
     */
    SESSION_EXPIRED: {
      title: "세션 만료",
      description: "세션이 만료되었습니다. 다시 로그인해 주세요.",
    },
  },
  USER: {
    PROFILE_UPDATE_SUCCESS: {
      title: "프로필 수정 완료",
      description: "프로필 정보가 성공적으로 수정되었습니다.",
    },
    PROFILE_UPDATE_FAILURE: {
      title: "프로필 수정 실패",
      description: "프로필 수정 중 문제가 발생했습니다.",
    },
    PROFILE_IMAGE_UPLOAD_FAILURE: {
      title: "프로필 이미지 업로드 실패",
      description: "이미지 업로드 중 문제가 발생했습니다.",
    },
  },
  /**
   * 그룹(Group) 도메인 메시지.
   */
  GROUP: {
    /**
     * 그룹 가입 신청 성공.
     */
    JOIN_REQUEST_SUCCESS: {
      title: "그룹 가입 신청 완료",
      description: "그룹 가입 신청이 완료되었습니다.",
    },
    /**
     * 그룹 가입 신청 실패.
     */
    JOIN_REQUEST_FAILURE: {
      title: "가입 신청 실패",
      description: "잠시 후 다시 시도해 주세요.",
    },
    /**
     * 그룹 가입 신청 승인 성공.
     */
    JOIN_APPLY_APPROVE_SUCCESS: {
      title: "가입 신청 승인 완료",
      description: "선택한 사용자의 가입 신청을 승인했습니다.",
    },
    /**
     * 그룹 가입 신청 승인 실패.
     */
    JOIN_APPLY_APPROVE_FAILURE: {
      title: "가입 신청 승인 실패",
      description: "가입 신청 승인 중 문제가 발생했습니다.",
    },
    /**
     * 그룹 가입 신청 거절 성공.
     */
    JOIN_APPLY_REJECT_SUCCESS: {
      title: "가입 신청 거절 완료",
      description: "선택한 사용자의 가입 신청을 거절했습니다.",
    },
    /**
     * 그룹 가입 신청 거절 실패.
     */
    JOIN_APPLY_REJECT_FAILURE: {
      title: "가입 신청 거절 실패",
      description: "가입 신청 거절 중 문제가 발생했습니다.",
    },
    /**
     * 그룹 탈퇴 성공.
     */
    LEAVE_SUCCESS: {
      title: "그룹 탈퇴 완료",
      description: "그룹에서 탈퇴했습니다.",
    },
    /**
     * 그룹 탈퇴 실패.
     */
    LEAVE_FAILURE: {
      title: "그룹 탈퇴 실패",
      description: "잠시 후 다시 시도해 주세요.",
    },
    /**
     * 그룹 수정 입력값 검증 실패.
     */
    UPDATE_VALIDATION: {
      title: "입력값을 확인해주세요.",
      description: "그룹명과 그룹 설명은 필수입니다.",
    },
    /**
     * 그룹 수정 성공.
     */
    UPDATE_SUCCESS: {
      title: "그룹 수정 완료",
      description: "그룹 정보가 성공적으로 수정되었습니다.",
    },
    /**
     * 그룹 수정 실패.
     */
    UPDATE_FAILURE: {
      title: "그룹 수정 실패",
      description: "그룹 수정 중 문제가 발생했습니다.",
    },
    /**
     * 그룹 삭제 성공.
     */
    DELETE_SUCCESS: {
      title: "그룹 삭제 완료",
      description: "그룹이 정상적으로 삭제되었습니다.",
    },
    /**
     * 그룹 삭제 실패.
     */
    DELETE_FAILURE: {
      title: "그룹 삭제 실패",
      description: "그룹 삭제 중 문제가 발생했습니다.",
    },
    /**
     * 그룹 멤버 추방 성공.
     */
    MEMBER_KICK_SUCCESS: {
      title: "멤버 추방 완료",
      description: "선택한 멤버를 그룹에서 추방했습니다.",
    },
    /**
     * 그룹 멤버 추방 실패.
     */
    MEMBER_KICK_FAILURE: {
      title: "멤버 추방 실패",
      description: "멤버 추방 중 문제가 발생했습니다.",
    },
    /**
     * 그룹 멤버 목록 조회 실패.
     */
    MEMBER_LIST_FAILURE: {
      title: "그룹 멤버 조회 실패",
      description: "그룹 멤버 목록을 불러오는 중 문제가 발생했습니다.",
    },
    /**
     * 그룹장 양도 성공.
     */
    OWNER_TRANSFER_SUCCESS: {
      title: "그룹장 양도 완료",
      description: "그룹장 권한을 성공적으로 양도했습니다.",
    },
    /**
     * 그룹장 양도 실패.
     */
    OWNER_TRANSFER_FAILURE: {
      title: "그룹장 양도 실패",
      description: "그룹장 양도 중 문제가 발생했습니다.",
    },
  },
  SCHEDULE: {
    CREATE_VALIDATION: {
      title: "입력값을 확인해주세요.",
      description: "일정명, 날짜, 일정 멤버를 확인해 주세요.",
    },
    CREATE_SUCCESS: {
      title: "여행 일정 생성 완료",
      description: "새 여행 일정이 생성되었습니다.",
    },
    CREATE_FAILURE: {
      title: "여행 일정 생성 실패",
      description: "여행 일정 생성 중 문제가 발생했습니다.",
    },
    LIST_FAILURE: {
      title: "여행 일정 조회 실패",
      description: "여행 일정 목록을 불러오는 중 문제가 발생했습니다.",
    },
    DETAIL_FAILURE: {
      title: "여행 메타 정보 조회 실패",
      description: "여행 메타 정보를 불러오는 중 문제가 발생했습니다.",
    },
    SETTLEMENT_DETAIL_FAILURE: {
      title: "정산 정보 조회 실패",
      description: "정산 정보를 불러오는 중 문제가 발생했습니다.",
    },
    SETTLEMENT_UPDATE_SUCCESS: {
      title: "정산 정보 수정 완료",
      description: "정산 정보가 성공적으로 수정되었습니다.",
    },
    SETTLEMENT_UPDATE_FAILURE: {
      title: "정산 정보 수정 실패",
      description: "정산 정보 수정 중 문제가 발생했습니다.",
    },
    MEMBER_ADD_SUCCESS: {
      title: "여행 멤버 추가 완료",
      description: "선택한 그룹원을 여행 일정에 추가했습니다.",
    },
    MEMBER_ADD_FAILURE: {
      title: "여행 멤버 추가 실패",
      description: "여행 멤버 추가 중 문제가 발생했습니다.",
    },
    LEAVE_SUCCESS: {
      title: "여행 일정 탈퇴 완료",
      description: "여행 일정에서 탈퇴했습니다.",
    },
    LEAVE_FAILURE: {
      title: "여행 일정 탈퇴 실패",
      description: "여행 일정 탈퇴 중 문제가 발생했습니다.",
    },
    COLLABORATION_EDITOR_INIT_FAILURE: {
      title: "일정 협업 에디터 준비 실패",
      description: "잠시 후 다시 시도해 주세요.",
    },
  },
} as const;
