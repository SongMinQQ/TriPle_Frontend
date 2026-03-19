import { notFound } from "next/navigation";
import { parseRouteGroupId, isValidRouteGroupId } from "@/entities/group/queries/group.query-utils";
import { getScheduleCreateMembers } from "@/features/schedule/create/model/getScheduleCreateMembers";
import { ScheduleCreateForm } from "@/features/schedule/create/ui/ScheduleCreateForm";

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
  const { members, requiredMemberId } = await getScheduleCreateMembers(groupId);

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">{"일정 생성"}</h1>
      <ScheduleCreateForm
        groupId={groupId}
        members={members}
        requiredMemberId={requiredMemberId}
      />
    </div>
  );
}
