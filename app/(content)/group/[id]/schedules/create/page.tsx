import { notFound } from "next/navigation";
import { parseRouteGroupId, isValidRouteGroupId } from "@/entities/group/queries/group.query-utils";
import { ScheduleCreatePageContent } from "@/features/schedule/create/ui/ScheduleCreatePageContent";

export default async function ScheduleCreatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidRouteGroupId(id)) {
    notFound();
  }

  const groupId = parseRouteGroupId(id, "schedule-create-page");

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">{"일정 생성"}</h1>
      <ScheduleCreatePageContent groupId={groupId} />
    </div>
  );
}
