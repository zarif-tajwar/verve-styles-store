import ShippingAddress from './ShippingAddress';
import PaymentElements from './PaymentElements';
import OrderItems from './OrderItems';

const CheckoutPage = async () => {
  return (
    <div className="container-main py-24">
      <div className="grid grid-cols-[1fr_0.5fr]">
        <div>
          <ShippingAddress />
          <OrderItems />
        </div>
        {/* <PaymentElements /> */}
      </div>
    </div>
  );
};
export default CheckoutPage;
