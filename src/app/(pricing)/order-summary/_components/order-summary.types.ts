export type PaymentOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export interface CardPaymentData {
  name: string;
  number: string;
  month: string;
  year: string;
  cvc: string;
}
