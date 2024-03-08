import { User } from 'lucia';

export type UserObjectClient = Pick<User, 'name' | 'email' | 'image'>;
