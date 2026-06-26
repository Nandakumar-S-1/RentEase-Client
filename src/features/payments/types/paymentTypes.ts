export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";
export type PaymentCategory =
  | "SECURITY_DEPOSIT"
  | "RENT"
  | "MAINTENANCE"
  | "LATE_FEE"
  | "OTHER";

export interface Payment {
  id: string;
  transactionId?: string;
  agreementId: string;
  propertyId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  category: PaymentCategory;
  dueDate?: string;
  paidDate?: string;
  paymentGateway?: string;
  paymentMethod?: string;
  status: PaymentStatus;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  failureReason?: string;
  receiptUrl?: string;
  isRefunded: boolean;
  createdAt: string;
  updatedAt: string;
  property?: { title: string; locationCity: string };
  payer?: {
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
  payee?: {
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
  agreement?: { agreementNumber: string };
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  paymentId: string;
}

export interface InitiateCheckoutRequest {
  successUrl: string;
  cancelUrl: string;
}
