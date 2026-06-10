import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type {
  Payment,
  CheckoutResponse,
  InitiateCheckoutRequest,
} from "../types/paymentTypes";

export const getPaymentById = async (id: string): Promise<Payment> => {
  const res = await axiosApi.get(API_ROUTES.GET_PAYMENT_BY_ID(id));
  return res.data.data;
};

export const getPaymentsByAgreement = async (
  agreementId: string,
): Promise<Payment[]> => {
  const res = await axiosApi.get(
    API_ROUTES.GET_PAYMENTS_BY_AGREEMENT(agreementId),
  );
  return res.data.data;
};

export const initiateCheckout = async (
  paymentId: string,
  data: InitiateCheckoutRequest,
): Promise<CheckoutResponse> => {
  const res = await axiosApi.post(
    API_ROUTES.INITIATE_CHECKOUT(paymentId),
    data,
  );
  return res.data.data;
};
