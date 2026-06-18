import { useState, useCallback } from "react";
import {
  getPaymentsByAgreement,
  getPaymentById,
  initiateCheckout,
} from "../services/paymentService";
import type { Payment } from "../types/paymentTypes";
import { PAGE_ROUTES } from "../../../config/routes";
import toast from "react-hot-toast";

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByAgreement = useCallback(async (agreementId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPaymentsByAgreement(agreementId);
      setPayments(data);
      return data;
    } catch {
      setError("Failed to load payments");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPaymentById(id);
      setCurrentPayment(data);
      return data;
    } catch {
      setError("Failed to load payment");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkout = useCallback(async (paymentId: string) => {
    setIsCheckingOut(true);
    try {
      const origin = window.location.origin;
      const result = await initiateCheckout(paymentId, {
        successUrl: `${origin}${PAGE_ROUTES.PAYMENT_SUCCESS}?paymentId=${paymentId}`,
        cancelUrl: `${origin}${PAGE_ROUTES.PAYMENT_CANCEL}?paymentId=${paymentId}`,
      });
      window.location.href = result.checkoutUrl;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  }, []);

  return {
    payments,
    currentPayment,
    isLoading,
    isCheckingOut,
    error,
    fetchByAgreement,
    fetchById,
    checkout,
  };
};
