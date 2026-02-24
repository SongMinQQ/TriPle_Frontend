import axios from "axios";

import api from "@/shared/api/common";
import { REQUEST_PATHS } from "@/shared/constants/paths";

interface UploadPresignRequest {
  presignedUrlRequestDtos: Array<{
    fileName: string;
    mimeType: string;
  }>;
}

interface UploadPresignResponse {
  presignedUrlResponseDtos: Array<{
    fileName: string;
    mimeType: string;
    key: string;
    presignedUrl: string;
    expiresAt: string;
    success: boolean;
    errorCode: string | null;
    message: string | null;
  }>;
}

interface UploadCompleteRequest {
  keys: string[];
}

interface UploadCompleteResponse {
  uploadResults: Array<{
    pendingKey: string;
    uploadedKey: string;
    success: boolean;
    httpStatus: number | null;
    message: string | null;
  }>;
}

/**
 * Upload a file through the common presigned-url flow and return uploaded key.
 */
export const uploadFile = async (file: File): Promise<string> => {
  const presignRequest: UploadPresignRequest = {
    presignedUrlRequestDtos: [
      {
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
      },
    ],
  };

  const { data: presignData } = await api.post<UploadPresignResponse>(
    REQUEST_PATHS.FILES.UPLOAD_PRESIGN,
    presignRequest
  );

  const presigned = presignData.presignedUrlResponseDtos[0];
  if (!presigned || !presigned.success || !presigned.presignedUrl || !presigned.key) {
    throw new Error(presigned?.message ?? "Failed to issue upload presigned URL.");
  }

  await axios.put(presigned.presignedUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  const completeRequest: UploadCompleteRequest = { keys: [presigned.key] };
  const { data: completeData } = await api.post<UploadCompleteResponse>(
    REQUEST_PATHS.FILES.UPLOAD_COMPLETE,
    completeRequest
  );

  const uploadResult =
    completeData.uploadResults.find((result) => result.pendingKey === presigned.key) ??
    completeData.uploadResults[0];

  if (!uploadResult || !uploadResult.success || !uploadResult.uploadedKey) {
    throw new Error(uploadResult?.message ?? "Failed to finalize uploaded file.");
  }

  return uploadResult.uploadedKey;
};
