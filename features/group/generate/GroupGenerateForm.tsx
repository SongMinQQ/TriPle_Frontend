"use client";

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  type GroupGenerateOptionalFormState,
  type GroupGenerateRequiredFormState,
} from "@/features/group/generate/model/groupGenerateForm";
import { GROUP_MEMBER_DEFAULT_LIMIT } from "@/entities/group/model/constants";
import GroupGenerateOptionalFields from "@/features/group/generate/ui/GroupGenerateOptionalFields";
import GroupGenerateRequiredFields from "@/features/group/generate/ui/GroupGenerateRequiredFields";
import GroupGenerateSubmitBtn from "@/features/group/generate/ui/GroupGenerateSubmitBtn";

interface GroupGenerateFormRenderParams {
  requiredForm: GroupGenerateRequiredFormState;
  optionalForm: GroupGenerateOptionalFormState;
  isThumbnailRemoved: boolean;
}

interface GroupGenerateFormProps {
  initialRequiredForm?: GroupGenerateRequiredFormState;
  initialOptionalForm?: GroupGenerateOptionalFormState;
  initialThumbnailPreviewUrl?: string;
  renderSubmitButton?: (params: GroupGenerateFormRenderParams) => ReactNode;
}

const DEFAULT_REQUIRED_FORM: GroupGenerateRequiredFormState = {
  groupName: "",
  description: "",
  maxMembers: GROUP_MEMBER_DEFAULT_LIMIT,
  isPublic: true,
};

const DEFAULT_OPTIONAL_FORM: GroupGenerateOptionalFormState = {
  thumbnailFile: null,
};

const GroupGenerateForm = ({
  initialRequiredForm = DEFAULT_REQUIRED_FORM,
  initialOptionalForm = DEFAULT_OPTIONAL_FORM,
  initialThumbnailPreviewUrl,
  renderSubmitButton,
}: GroupGenerateFormProps) => {
  const [requiredForm, setRequiredForm] = useState<GroupGenerateRequiredFormState>(
    initialRequiredForm
  );
  const [optionalForm, setOptionalForm] = useState<GroupGenerateOptionalFormState>(
    initialOptionalForm
  );
  const [isThumbnailRemoved, setIsThumbnailRemoved] = useState(false);

  const selectedThumbnailPreviewUrl = useMemo(() => {
    if (!optionalForm.thumbnailFile) {
      return null;
    }

    return URL.createObjectURL(optionalForm.thumbnailFile);
  }, [optionalForm.thumbnailFile]);

  useEffect(() => {
    return () => {
      if (!selectedThumbnailPreviewUrl) {
        return;
      }

      URL.revokeObjectURL(selectedThumbnailPreviewUrl);
    };
  }, [selectedThumbnailPreviewUrl]);

  const thumbnailPreviewUrl =
    isThumbnailRemoved ? null : selectedThumbnailPreviewUrl ?? initialThumbnailPreviewUrl ?? null;

  const handleThumbnailFileChange = (thumbnailFile: File | null) => {
    setOptionalForm((prev) => ({ ...prev, thumbnailFile }));

    if (thumbnailFile) {
      setIsThumbnailRemoved(false);
    }
  };

  const handleThumbnailRemove = () => {
    setOptionalForm((prev) => ({ ...prev, thumbnailFile: null }));
    setIsThumbnailRemoved(true);
  };

  const submitButton =
    renderSubmitButton?.({
      requiredForm,
      optionalForm,
      isThumbnailRemoved,
    }) ?? <GroupGenerateSubmitBtn requiredForm={requiredForm} optionalForm={optionalForm} />;

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
        previewSrc={thumbnailPreviewUrl}
        onThumbnailFileChange={handleThumbnailFileChange}
        onThumbnailRemove={handleThumbnailRemove}
      />

      <div className="mt-12 flex justify-center">
        {submitButton}
      </div>
    </Fragment>
  );
};

export default GroupGenerateForm;
