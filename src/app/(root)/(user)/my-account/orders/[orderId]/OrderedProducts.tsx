import * as AddressDetailsCard from '@/components/UI/AccountDetailsCard';
import { Button } from '@/components/UI/Button';
import Divider from '@/components/UI/Divider';
import { formatSizeText } from '@/components/UI/SizeBadge';
import { db } from '@/lib/db';
import { InvoiceSelect } from '@/lib/db/schema/invoice';
import { orderLine } from '@/lib/db/schema/orderLine';
import { productEntries } from '@/lib/db/schema/productEntries';
import { products } from '@/lib/db/schema/products';
import { sizes } from '@/lib/db/schema/sizes';
import { cn, priceFormat } from '@/lib/util';
import { PencilIcon } from '@heroicons/react/16/solid';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { eq } from 'drizzle-orm';
import React from 'react';

const OrderedProducts = async ({
  orderId,
  invoiceData,
}: {
  orderId: number;
  invoiceData: InvoiceSelect;
}) => {
  const orderLineItems = await db
    .select()
    .from(orderLine)
    .innerJoin(productEntries, eq(productEntries.id, orderLine.productEntryId))
    .innerJoin(products, eq(products.id, productEntries.productID))
    .innerJoin(sizes, eq(sizes.id, productEntries.sizeID))
    .where(eq(orderLine.orderId, orderId))
    .orderBy(orderLine.createdAt, orderLine.id);

  const subtotal = Number.parseFloat(invoiceData.subtotal);
  const deliveryCharge = Number.parseFloat(invoiceData.deliveryCharge);
  const taxes = Number.parseFloat(invoiceData.taxes ?? '0');
  const discount = Number.parseFloat(
    invoiceData.totalDiscountInCurrency ?? '0',
  );
  const total = subtotal + deliveryCharge + taxes - discount;

  return (
    <div>
      <AddressDetailsCard.Card>
        <AddressDetailsCard.CardHeader className="">
          <AddressDetailsCard.CardHeaderIcon className="size-10 rounded-lg">
            <ShoppingBagIcon className="size-6" />
          </AddressDetailsCard.CardHeaderIcon>
          <div>
            <h2 className="text-lg font-semibold text-primary-500">
              Ordered Products <br />
              with Price Summary
            </h2>
          </div>
        </AddressDetailsCard.CardHeader>
        <AddressDetailsCard.CardList className="">
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Subtotal
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {priceFormat(subtotal)}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Delivery Charge
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {priceFormat(deliveryCharge)}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Taxes
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {priceFormat(taxes)}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
          <AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItemHeading>
              Total
            </AddressDetailsCard.CardListItemHeading>
            <AddressDetailsCard.CardListItemDescription>
              {priceFormat(total)}
            </AddressDetailsCard.CardListItemDescription>
          </AddressDetailsCard.CardListItem>
        </AddressDetailsCard.CardList>
        <Divider className="my-8" />
        <ul className="grid grid-cols-3 gap-x-6 gap-y-12">
          {orderLineItems.map((orderLine, i) => {
            const pricePerUnit = Number.parseFloat(
              orderLine.order_line.pricePerUnit,
            );
            const quantity = orderLine.order_line.quantity;
            const discountInPercentage = Number.parseFloat(
              orderLine.order_line.discount ?? '0',
            );
            const total =
              pricePerUnit * quantity * (1 - discountInPercentage / 100);
            return (
              <React.Fragment key={i}>
                <li
                  className={cn(
                    'grid max-w-[39.4rem] grid-cols-[7rem_1fr] gap-4',
                    'flex flex-col',
                  )}
                >
                  <span className="aspect-[1.4/1] rounded-xl bg-primary-50"></span>
                  <div className="flex flex-col justify-between gap-3">
                    <div className="">
                      <span className="font-base font-semibold leading-none text-primary-400">
                        {orderLine.products.name}
                      </span>
                    </div>
                    <dl
                      className={cn(
                        'mb-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm',
                        '[&_dd]:font-medium [&_dd]:text-primary-400',
                        '[&_dt]:font-semibold [&_dt]:text-primary-500',
                      )}
                    >
                      <div className="space-y-0.5">
                        <dd>Size</dd>
                        <dt>{formatSizeText(orderLine.sizes.name)}</dt>
                      </div>
                      <div className="space-y-0.5">
                        <dd>Quantity</dd>
                        <dt>{orderLine.order_line.quantity}</dt>
                      </div>
                      <div className="space-y-0.5">
                        <dd>Price Per Unit</dd>
                        <dt>{priceFormat(pricePerUnit)}</dt>
                      </div>

                      {discountInPercentage > 0 && (
                        <div className="space-y-0.5">
                          <>
                            <dd>Discount</dd>
                            <dt>{discountInPercentage}%</dt>
                          </>
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <dd>Total</dd>
                        <dt className="!font-semibold text-primary-500">
                          {priceFormat(total)}
                        </dt>
                      </div>
                    </dl>
                    <Button
                      roundness={'lg'}
                      className="gap-2"
                      variant={'secondary'}
                    >
                      <PencilIcon className="size-4" />
                      Post a review
                    </Button>
                  </div>
                </li>
                {/* <Divider className="bg-primary-50" /> */}
              </React.Fragment>
            );
          })}
        </ul>
      </AddressDetailsCard.Card>
    </div>
  );
};
export default OrderedProducts;
