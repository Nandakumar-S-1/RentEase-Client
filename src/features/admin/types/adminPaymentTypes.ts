export interface AdminPayment {
  id: string;
  amount: number;
  status: string;
  category: string;
  dueDate: string | null;
  paidDate: string | null;
  createdAt: string;
  agreement: {
    id: string;
    agreementNumber: string;
  };
  payer: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface AdminPaymentsResponse {
  payments: AdminPayment[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
