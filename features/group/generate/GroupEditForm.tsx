"use client";

import type { Group } from "@/entities/group/model/types";
import GroupGenerateForm from "@/features/group/generate/GroupGenerateForm";
import GroupUpdateSubmitBtn from "@/features/group/generate/ui/GroupUpdateSubmitBtn";

interface GroupEditFormProps {
  group: Group;
}

const GroupEditForm = ({ group }: GroupEditFormProps) => {
  return (
    <GroupGenerateForm
      key={group.groupId}
      initialRequiredForm={{
        groupName: group.name,
        description: group.description,
        maxMembers: group.memberLimit,
        isPublic: group.groupKind !== "PRIVATE",
      }}
      initialThumbnailPreviewUrl={group.thumbNailUrl || group.image}
      renderSubmitButton={({ requiredForm, optionalForm, isThumbnailRemoved }) => (
        <GroupUpdateSubmitBtn
          groupId={group.groupId}
          initialThumbNailUrl={group.thumbNailUrl}
          requiredForm={requiredForm}
          optionalForm={optionalForm}
          isThumbnailRemoved={isThumbnailRemoved}
        />
      )}
    />
  );
};

export default GroupEditForm;
