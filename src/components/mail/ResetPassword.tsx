import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface ResetPasswordProps {
  firstName: string;
  resetLink: string;
}

export const ResetPassword = ({ firstName, resetLink }: ResetPasswordProps) => {
  return (
    <Html>
      <Head />
      <Preview>{'Reset your Verve Password'}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-lg border border-solid border-[#e6e6e6] p-[20px]">
            <Text className="mb-6 text-base">Hi {firstName},</Text>
            <Text className="text-base">
              Someone recently requested a password reset for your Verve
              account. If this was you, you can reset your password here:
            </Text>
            <Button
              href={resetLink}
              className="text-medium mb-4 rounded-lg bg-black px-5 py-3 text-base text-white"
            >
              Reset Password
            </Button>
            <Text className="text-base">
              {`If you don't want to reset your password or didn't request this,
              just ignore and delete this message.`}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
