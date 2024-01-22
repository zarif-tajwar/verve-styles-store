import ShippingAddress from './ShippingAddress';
import PaymentElements from './PaymentElements';

const CheckoutPage = async () => {
  return (
    <div className="container-main">
      <div className="grid grid-cols-[1fr_0.5fr]">
        <div>
          <ShippingAddress />
        </div>
        {/* <PaymentElements /> */}
      </div>
    </div>
  );
};
export default CheckoutPage;
