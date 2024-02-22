import {
  CartItemsForCheckout,
  calcPricingDetails,
} from '@/lib/server/checkout';
import PaymentSectionClient from './PaymentSectionClient';

const PaymentSection = ({
  cartItems,
}: {
  cartItems: NonNullable<CartItemsForCheckout>;
}) => {
  const { total, deliveryCharge, subtotal, taxes, totalDiscount } =
    calcPricingDetails(cartItems);

  return (
    <PaymentSectionClient
      total={total}
      deliveryCharge={deliveryCharge}
      subtotal={subtotal}
      taxes={taxes}
      totalDiscount={totalDiscount}
    />
  );
};
export default PaymentSection;
