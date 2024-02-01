import type { Stripe } from 'stripe';

import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe/server-side';
import { db } from '@/lib/db';
import { orderPaymentDetails } from '@/lib/db/schema/orderPaymentDetails';
import { orderDetails } from '@/lib/db/schema/orderDetails';
import { SQL, eq, inArray, sql } from 'drizzle-orm';
import { orderLine } from '@/lib/db/schema/orderLine';
import { QueryBuilder } from 'drizzle-orm/pg-core';
import {
  ProductEntrySelect,
  productEntries,
} from '@/lib/db/schema/productEntries';
import { env } from '@/lib/validation/env.mjs';

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      env.STRIPE_WEBHOOK_KEY,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id);
  const date = new Date();
  try {
    if (event.type === 'payment_intent.succeeded') {
      const stripePaymentData = event.data.object as Stripe.PaymentIntent;
      const orderId = stripePaymentData.metadata.orderId
        ? Number.parseInt(stripePaymentData.metadata.orderId)
        : undefined;

      if (!orderId) {
        throw new Error(`OrderId was not included!`);
      }

      await db.transaction(async (tx) => {
        const orderDetailsPromise = tx
          .update(orderDetails)
          .set({ statusId: 2, updatedAt: date })
          .where(eq(orderDetails.orderId, orderId));
        const createdPaymentDetailsPromise = tx
          .insert(orderPaymentDetails)
          .values({
            orderId,
            paymentMethod: 'stripe',
            paymentMethodSessionId: stripePaymentData.id,
          })
          .returning();

        await Promise.all([orderDetailsPromise, createdPaymentDetailsPromise]);
      });

      console.log(`💰 PaymentIntent status: ${stripePaymentData.status}`);
    }
    if (event.type === 'payment_intent.payment_failed') {
      const stripePaymentData = event.data.object as Stripe.PaymentIntent;
      const orderId = stripePaymentData.metadata.orderId
        ? Number.parseInt(stripePaymentData.metadata.orderId)
        : undefined;

      if (!orderId) {
        throw new Error(`OrderId was not included!`);
      }

      await db.transaction(async (tx) => {
        const orderLinesData = await tx
          .select()
          .from(orderLine)
          .where(eq(orderLine.orderId, orderId));

        const qb = new QueryBuilder();
        const stockSqlChunks: SQL[] = [];
        const productEntryIds: ProductEntrySelect['id'][] = [];

        stockSqlChunks.push(sql`(case`);
        for (const orderLine of orderLinesData) {
          // for updating stock quantity
          productEntryIds.push(orderLine.productEntryId);
          stockSqlChunks.push(
            sql`when ${productEntries.id} = ${
              orderLine.productEntryId
            } then (${qb
              .select({
                newQuantity: sql<number>`${productEntries.quantity} + ${orderLine.quantity}`,
              })
              .from(productEntries)
              .where(eq(productEntries.id, orderLine.productEntryId))})`,
          );
        }
        stockSqlChunks.push(sql`end)`);
        const finalStockUpdateSql = sql.join(stockSqlChunks, sql.raw(' '));
        const stockUpdatePromise = tx
          .update(productEntries)
          .set({ quantity: finalStockUpdateSql, updatedAt: date })
          .where(inArray(productEntries.id, productEntryIds));

        const orderDetailsPromise = tx
          .update(orderDetails)
          .set({ statusId: 7, updatedAt: date })
          .where(eq(orderDetails.orderId, orderId));

        await Promise.all([stockUpdatePromise, orderDetailsPromise]);
      });
      console.log(
        `❌ Payment failed: ${stripePaymentData.last_payment_error?.message}`,
      );
      console.log(`❌ Payment failed: Stripe ID: ${stripePaymentData.id}
      Order ID: ${orderId}`);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Webhook handler failed' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: 'Received' }, { status: 200 });
}
