"use client";

import { useState } from "react";
import { initialScheduleMarkdownContent } from "@/features/schedule/detail/model/scheduleDetailState";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";

export function ScheduleItineraryEditorSection() {
  const [markdownContent, setMarkdownContent] = useState(initialScheduleMarkdownContent);

  return (
    <section aria-label="여행 일정 에디터">
      <MarkdownEditor value={markdownContent} onChange={setMarkdownContent} />
    </section>
  );
}
