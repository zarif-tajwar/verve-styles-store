import Divider from '@/components/UI/Divider';
import PaymentElements from './PaymentElements';
import {
  CartItemsForCheckout,
  calcPricingDetails,
} from '@/lib/server/checkout';
import { priceFormat } from '@/lib/util';

const PaymentSection = ({
  cartItems,
}: {
  cartItems: NonNullable<CartItemsForCheckout>;
}) => {
  const { total, deliveryCharge, subtotal, taxes, totalDiscount } =
    calcPricingDetails(cartItems);

  return (
    <div className="h-max rounded-2xl p-8 shadow-lg">
      <div className="mb-4 space-y-1">
        <h2 className="text-2xl font-semibold">Payment</h2>
        <p className="min-h-[2lh] text-primary-400">
          View price details and make payment to confirm your order
        </p>
      </div>
      <div className="">
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-semibold">Summary</h3>
          <div className="text-sm">
            <dl className="flex flex-col gap-2">
              <div className="flex justify-between">
                <dd className="font-medium text-primary-400">Subtotal</dd>
                <dd className="font-medium text-primary-500">
                  {priceFormat(subtotal)}
                </dd>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between">
                  <dd className="font-medium text-primary-400">Discount</dd>
                  <dd className="font-medium text-emerald-500">
                    {priceFormat(totalDiscount)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dd className="font-medium text-primary-400">
                  Delivery Charge
                </dd>
                <dd className="font-medium text-primary-500">
                  {priceFormat(deliveryCharge)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dd className="font-medium text-primary-400">Taxes</dd>
                <dd className="font-medium text-primary-500">
                  {priceFormat(taxes)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dd className="font-medium text-primary-400">Total</dd>
                <dd className="font-medium text-primary-500">
                  {priceFormat(total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div>
          <PaymentElements amount={total} />
        </div>
      </div>
    </div>
  );
};
export default PaymentSection;
