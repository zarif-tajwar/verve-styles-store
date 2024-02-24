import * as AddressDetailsCard from '@/components/UI/AccountDetailsCard';
import { db } from '@/lib/db';
import { invoice } from '@/lib/db/schema/invoice';
import { orderCustomerDetails } from '@/lib/db/schema/orderCustomerDetails';
import { orderDetails } from '@/lib/db/schema/orderDetails';
import { orderPaymentDetails } from '@/lib/db/schema/orderPaymentDetails';
import { dateFormatter, priceFormat, wait } from '@/lib/util';
import {
  ClockIcon,
  CreditCardIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { eq } from 'drizzle-orm';
import OrderStatus from '../../OrderStatus';

const Details = async ({
  orderId,
  orderStatus,
  total,
}: {
  orderId: number;
  orderStatus: string;
  total: number;
}) => {
  const orderData = (
    await db
      .select()
      .from(orderDetails)
      .innerJoin(invoice, eq(invoice.orderId, orderDetails.orderId))
      .leftJoin(
        orderPaymentDetails,
        eq(orderPaymentDetails.orderId, orderDetails.orderId),
      )
      .innerJoin(
        orderCustomerDetails,
        eq(orderCustomerDetails.orderId, orderDetails.orderId),
      )
      .where(eq(orderDetails.orderId, orderId))
  ).at(0);

  if (!orderData) return null;

  const isPaid = !!orderData.order_payment_details?.orderId;

  return (
    <div className="grid grid-cols-1 gap-6">
      <AddressDetailsCard.Card className="">
        <AddressDetailsCard.CardHeader className="mb-6">
          <AddressDetailsCard.CardHeaderIcon className="size-10 rounded-lg">
            <ClockIcon className="size-6" />
          </AddressDetailsCard.CardHeaderIcon>
          <div>
            <h2 className="text-lg font-bold text-primary-500">
              Order Time & Status
            </h2>
          </div>
        </AddressDetailsCard.CardHeader>
        <AddressDetailsCard.CardList>
          {orderData.order_details?.placedAt && (
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Order Placed At
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {dateFormatter(orderData.order_details.placedAt, true)}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
          )}
          {orderData.order_details?.deliveryDate && (
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Estimated Delivery Date
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {dateFormatter(orderData.order_details.deliveryDate)}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
          )}
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Order Status
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              <OrderStatus
                className="m-0 bg-primary-0 p-0"
                status={orderStatus}
              />
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
        </AddressDetailsCard.CardList>
      </AddressDetailsCard.Card>
      <AddressDetailsCard.Card className="">
        <AddressDetailsCard.CardHeader className="mb-6">
          <AddressDetailsCard.CardHeaderIcon className="size-10 rounded-lg">
            <CreditCardIcon className="size-6" />
          </AddressDetailsCard.CardHeaderIcon>
          <div>
            <h2 className="text-lg font-bold text-primary-500">
              Payment Details
            </h2>
          </div>
        </AddressDetailsCard.CardHeader>
        <AddressDetailsCard.CardList>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Payment Status
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {isPaid ? 'Paid' : 'Pending'}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Payment Method
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {orderData.order_payment_details?.paymentMethod ?? 'N/A'}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              {isPaid ? `Paid Amount` : `Due Amount`}
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {priceFormat(total)}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
        </AddressDetailsCard.CardList>
      </AddressDetailsCard.Card>
      <AddressDetailsCard.Card className="">
        <AddressDetailsCard.CardHeader className="mb-6">
          <AddressDetailsCard.CardHeaderIcon className="size-10 rounded-lg">
            <UserIcon className="size-6" />
          </AddressDetailsCard.CardHeaderIcon>
          <div>
            <h2 className="text-lg font-bold text-primary-500">
              Customer Details
            </h2>
          </div>
        </AddressDetailsCard.CardHeader>
        <AddressDetailsCard.CardList>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Name
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {orderData.order_customer_details?.customerName}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Email
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {orderData.order_customer_details?.customerEmail}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Address
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {orderData.order_customer_details?.address}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Country
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {orderData.order_customer_details?.country}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              City
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {orderData.order_customer_details?.city}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Phone
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {orderData.order_customer_details?.phone}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
        </AddressDetailsCard.CardList>
      </AddressDetailsCard.Card>
    </div>
  );
};
export default Details;
