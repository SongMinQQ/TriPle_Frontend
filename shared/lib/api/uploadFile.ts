import axios from "axios";
import api from "@/shared/lib/api/client";
import { REQUEST_PATHS } from "@/shared/constants/paths";

interface UploadPresignRequest {
  presignedUrlRequestDtos: Array<{
    fileName: string;
    mimeType: string;
  }>;
}

interface UploadPresignItem {
  fileName: string;
  mimeType: string;
  key: string;
  presignedUrl: string;
  expiresAt: string;
  success?: boolean;
  errorCode?: number | string | null;
  message?: string | null;
}

interface UploadPresignResponse {
  presignedUrlResponses?: UploadPresignItem[];
  // Backward compatibility for legacy response shape.
  presignedUrlResponseDtos?: UploadPresignItem[];
}

interface UploadCompleteRequest {
  keys: string[];
}

interface UploadCompleteResponse {
  uploadResults?: Array<{
    pendingKey: string;
    uploadedKey: string;
    uploadedUrl?: string;
    success?: boolean;
    httpStatus?: number | string | null;
    message?: string | null;
  }>;
}

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

  const presignedResponses =
    presignData.presignedUrlResponses ?? presignData.presignedUrlResponseDtos ?? [];
  const presigned = presignedResponses[0];

  if (
    !presigned ||
    presigned.success === false ||
    !presigned.presignedUrl ||
    !presigned.key
  ) {
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

  const uploadResults = completeData.uploadResults ?? [];
  const uploadResult =
    uploadResults.find((result) => result.pendingKey === presigned.key) ??
    uploadResults[0];

  if (
    !uploadResult ||
    uploadResult.success === false ||
    !uploadResult.uploadedKey ||
    !uploadResult.uploadedUrl
  ) {
    throw new Error(uploadResult?.message ?? "Failed to finalize uploaded file.");
  }

  return uploadResult.uploadedUrl;
};
