import Sqids from 'sqids';
import { env } from '@/lib/validation/env';

// For hiding sensitive integer values

export const sqids = new Sqids({
  alphabet: env.SQID_SECRET,
  minLength: 10,
});

export const encodeSingleSqid = (id: number) => {
  return sqids.encode([id]);
};

export const decodeSingleSqid = (encodedSqid: string) => {
  return sqids.decode(encodedSqid).at(0) as number;
};
