import { initEdgeStore } from '@edgestore/server';
import {
  initEdgeStoreClient,
  type InferClientResponse,
} from '@edgestore/server/core';
import { z } from 'zod';
import 'dotenv/config';
// import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
const es = initEdgeStore.create();
/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket()
    .input(
      z.object({
        attribute: z.string().optional(),
        clothing: z.string().optional(),
      }),
    )
    .metadata(({ input }) => ({ ...input })),
});
// const handler = createEdgeStoreNextHandler({
//   router: edgeStoreRouter,
// });
// export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;

export const edgeStoreBackendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});

export type EdgeStoreClientResponse = InferClientResponse<EdgeStoreRouter>;
