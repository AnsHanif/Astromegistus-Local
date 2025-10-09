export type StripeProductPayment = {
  totalAmount: number;
  cartItems: any[];
  paymentMethodId?: string;
};
