import * as AddressDetailsCard from '@/components/UI/AccountDetailsCard';
import Divider from '@/components/UI/Divider';
import { formatSizeText } from '@/components/UI/SizeBadge';
import { db } from '@/lib/db';
import { InvoiceSelect } from '@/lib/db/schema/invoice';
import { orderLine } from '@/lib/db/schema/orderLine';
import { productEntries } from '@/lib/db/schema/productEntries';
import { productImages } from '@/lib/db/schema/productImages';
import { products } from '@/lib/db/schema/products';
import { sizes } from '@/lib/db/schema/sizes';
import { cn, priceFormat } from '@/lib/util';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { and, eq } from 'drizzle-orm';
import Image from 'next/image';
import React from 'react';
import PostAReviewBtn from './PostAReviewBtn';

const OrderedProducts = async ({
  orderId,
  invoiceData,
}: {
  orderId: number;
  invoiceData: InvoiceSelect;
}) => {
  const orderLineItems = await db
    .selectDistinct()
    .from(orderLine)
    .innerJoin(productEntries, eq(productEntries.id, orderLine.productEntryId))
    .innerJoin(products, eq(products.id, productEntries.productID))
    .leftJoin(productImages, eq(productImages.productID, products.id))
    .innerJoin(sizes, eq(sizes.id, productEntries.sizeID))
    .where(
      and(eq(orderLine.orderId, orderId), eq(productImages.isDefault, true)),
    )
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
            <h2 className="text-lg font-bold text-primary-500">
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
        <Divider className="my-6 bg-primary-50" />
        <ul className="grid auto-rows-auto grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
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
                    'row-span-3 grid grid-cols-1 grid-rows-subgrid gap-x-0 gap-y-0',
                    // 'flex flex-col',
                  )}
                >
                  <div>
                    <div className="relative mb-3 aspect-[1.2/1] max-h-min w-full overflow-hidden rounded-xl">
                      {orderLine.product_images?.url ? (
                        <Image
                          alt={orderLine.products.name}
                          src={orderLine.product_images.url}
                          className="object-cover"
                          fill
                        />
                      ) : (
                        <span className="h-full w-full bg-primary-50"></span>
                      )}
                    </div>
                    <div className="mb-5">
                      <h4 className="text-lg font-semibold leading-none text-primary-400">
                        {orderLine.products.name}
                      </h4>
                    </div>
                  </div>
                  <div className="mb-5 flex flex-col justify-between gap-3">
                    <dl
                      className={cn(
                        'grid grid-cols-2 gap-x-4 gap-y-3 text-sm',
                        '[&_dd]:font-medium [&_dd]:text-primary-400',
                        '[&_dt]:font-semibold [&_dt]:text-primary-500',
                      )}
                    >
                      <div className="space-y-1">
                        <dd>Size</dd>
                        <dt>{formatSizeText(orderLine.sizes.name)}</dt>
                      </div>
                      <div className="space-y-1">
                        <dd>Quantity</dd>
                        <dt>{orderLine.order_line.quantity}</dt>
                      </div>
                      <div className="space-y-1">
                        <dd>Price Per Unit</dd>
                        <dt>{priceFormat(pricePerUnit)}</dt>
                      </div>

                      {discountInPercentage > 0 ||
                        ((i + 1) % 2 !== 0 && (
                          <div className="space-y-1">
                            <>
                              <dd>Discount</dd>
                              <dt>{discountInPercentage}%</dt>
                            </>
                          </div>
                        ))}
                      <div className="space-y-1">
                        <dd>Total</dd>
                        <dt className="!font-semibold text-primary-500">
                          {priceFormat(total)}
                        </dt>
                      </div>
                    </dl>
                  </div>
                  <PostAReviewBtn />
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </AddressDetailsCard.Card>
    </div>
  );
};
export default OrderedProducts;
