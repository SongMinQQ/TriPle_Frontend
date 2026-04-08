"use client";

import { useParams } from "next/navigation";
import {
  getRouteParam,
  getScheduleEditorDocumentName,
} from "@/features/schedule/detail/model/scheduleEditorUtils";
import { ScheduleEditor } from "@/features/schedule/detail/ui/ScheduleEditor";

export function ScheduleItineraryEditorSection() {
  const params = useParams<{ scheduleId: string }>();
  const scheduleId = getRouteParam(params?.scheduleId);
  const documentName = getScheduleEditorDocumentName(scheduleId);

  return (
    <section aria-label="여행 일정 에디터">
      <ScheduleEditor documentName={documentName} travelId={scheduleId} />
    </section>
  );
}
