"use client";

import { Fragment, useState } from "react";

import {
  type GroupGenerateOptionalFormState,
  type GroupGenerateRequiredFormState,
} from "@/features/group/generate/model/groupGenerateForm";
import { GROUP_MEMBER_DEFAULT_LIMIT } from "@/entities/group/model/constants";
import GroupGenerateOptionalFields from "@/features/group/generate/ui/GroupGenerateOptionalFields";
import GroupGenerateRequiredFields from "@/features/group/generate/ui/GroupGenerateRequiredFields";
import GroupGenerateSubmitBtn from "@/features/group/generate/ui/GroupGenerateSubmitBtn";

const GroupGenerateForm = () => {
  const [requiredForm, setRequiredForm] = useState<GroupGenerateRequiredFormState>({
    groupName: "",
    description: "",
    maxMembers: GROUP_MEMBER_DEFAULT_LIMIT,
    isPublic: true,
  });
  const [optionalForm, setOptionalForm] = useState<GroupGenerateOptionalFormState>({
    thumbnailFile: null,
  });

  return (
    <Fragment>
      <GroupGenerateRequiredFields
        form={requiredForm}
        onGroupNameChange={(groupName) =>
          setRequiredForm((prev) => ({ ...prev, groupName }))
        }
        onDescriptionChange={(description) =>
          setRequiredForm((prev) => ({ ...prev, description }))
        }
        onMaxMembersChange={(maxMembers) =>
          setRequiredForm((prev) => ({ ...prev, maxMembers }))
        }
        onIsPublicChange={(isPublic) =>
          setRequiredForm((prev) => ({ ...prev, isPublic }))
        }
      />
      <GroupGenerateOptionalFields
        form={optionalForm}
        onThumbnailFileChange={(thumbnailFile) =>
          setOptionalForm((prev) => ({ ...prev, thumbnailFile }))
        }
      />

      <div className="mt-12 flex justify-center">
        <GroupGenerateSubmitBtn requiredForm={requiredForm} optionalForm={optionalForm} />
      </div>
    </Fragment>
  );
};

export default GroupGenerateForm;
