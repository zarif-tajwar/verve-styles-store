import Cart from '@/components/Cart/Cart';
import { DELIVERY_CHARGE } from '@/lib/constants/dummy-values';

const CartPage = async () => {
  const deliveryCharge = DELIVERY_CHARGE;
  return <Cart deliveryCharge={deliveryCharge} />;
};

export default CartPage;
