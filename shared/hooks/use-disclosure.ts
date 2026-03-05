"use client";

import { useCallback, useState } from "react";

interface UseDisclosureOptions {
  /**
   * 훅 초기 마운트 시 open 상태를 지정합니다.
   *
   * @default false
   */
  initialOpen?: boolean;
}

interface UseDisclosure {
  /** 현재 열림 상태 */
  isOpen: boolean;
  /** 상태를 열림(true)으로 변경 */
  open: () => void;
  /** 상태를 닫힘(false)으로 변경 */
  close: () => void;
  /** 현재 상태를 반전 */
  toggle: () => void;
  /** 상태를 원하는 값으로 직접 설정 */
  setOpen: (next: boolean) => void;
}

/**
 * 모달/드롭다운/패널처럼 열고 닫는 UI 상태를 공통으로 관리하는 훅입니다.
 *
 * @param options 초기 open 상태 옵션
 * @returns 열림 상태와 제어 함수 집합
 */
export function useDisclosure(
  options: UseDisclosureOptions = {}
): UseDisclosure {
  const { initialOpen = false } = options;
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((previous) => !previous);
  }, []);

  const setOpen = useCallback((next: boolean) => {
    setIsOpen(next);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setOpen,
  };
}
