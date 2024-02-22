import Divider from '@/components/UI/Divider';
import PaymentElements from './PaymentElements';
import {
  CartItemsForCheckout,
  calcPricingDetails,
} from '@/lib/server/checkout';
import { cn, priceFormat } from '@/lib/util';

const PaymentSection = ({
  cartItems,
}: {
  cartItems: NonNullable<CartItemsForCheckout>;
}) => {
  const { total, deliveryCharge, subtotal, taxes, totalDiscount } =
    calcPricingDetails(cartItems);

  return (
    <div
      className={cn(
        'shadow-ghosting h-max rounded-main border-2 border-[hsl(0,0%,0%)] p-6 xl:p-8',
        // 'bg-primary-400 [&_*]:text-primary-0',
      )}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Payment</h2>
        <p className="text-primary-400">
          View price details and make payment to confirm your order
        </p>
      </div>
      <div className="my-6 h-px w-full bg-primary-100"></div>
      <div className="">
        <div className="">
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
        <div className="my-6 h-px w-full bg-primary-100"></div>
        <div>
          <PaymentElements amount={total} />
        </div>
      </div>
    </div>
  );
};
export default PaymentSection;
