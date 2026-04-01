import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type {
  SubmitVerificationData,
  VerificationResponse,
  VerificationStatusResponse,
} from "../types/verificationType";

export const submitVerification = async (
  data: SubmitVerificationData,
): Promise<VerificationResponse> => {
  const formData = new FormData();
  formData.append("documentType", data.documentType);
  formData.append("document", data.document);

  const response = await axiosApi.post(
    API_ROUTES.SUBMIT_VERIFICATION,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const getVerificationStatus =
  async (): Promise<VerificationStatusResponse> => {
    const response = await axiosApi.get(API_ROUTES.VERIFICATION_STATUS);
    return response.data;
  };
