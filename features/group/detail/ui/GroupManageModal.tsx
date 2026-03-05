"use client";

import type { GroupManageActionButton } from "@/features/group/detail/lib/groupManageModalActions";
import { cn } from "@/shared/lib/utils";
import { Modal } from "@/shared/ui/modal";

interface GroupManageModalProps<Option extends string = string> {
  open: boolean;
  onClose: () => void;
  onSelect: (option: Option) => void;
  buttons: ReadonlyArray<GroupManageActionButton<Option>>;
  title?: string;
  description?: string;
}

export function GroupManageModal<Option extends string = string>({
  open,
  onClose,
  onSelect,
  buttons,
  title = "그룹 관리",
  description = "원하는 작업을 선택해주세요.",
}: GroupManageModalProps<Option>) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="mt-5 flex flex-col gap-2">
        {buttons.map(({ option, name, tone = "default" }) => (
          <button
            key={option}
            type="button"
            className={cn(
              "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
              tone === "destructive"
                ? "border-destructive/40 text-destructive hover:bg-destructive/10"
                : "border-border text-foreground hover:bg-muted"
            )}
            onClick={() => onSelect(option)}
          >
            {name}
          </button>
        ))}
      </div>
    </Modal>
  );
}
