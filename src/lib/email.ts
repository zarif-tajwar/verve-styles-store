import 'server-only';

import { createTransport, SendMailOptions } from 'nodemailer';
import { env } from './validation/env.mjs';

export const emailTransporter = createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 587 ? false : true,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

type SendEmailProps = { emailOptions: Omit<SendMailOptions, 'from'> };

export const sendEmail = async ({ emailOptions }: SendEmailProps) => {
  await emailTransporter.sendMail({
    from: {
      name: 'Verve Styles - NextJS E-commerce Store',
      address: env.SMTP_FROM,
    },
    ...emailOptions,
  });
};
