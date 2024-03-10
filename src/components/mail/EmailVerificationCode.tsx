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

interface EmailVerificaionCodeProps {
  firstName: string;
  code: number;
}

export const EmailVerificaionCode = ({
  firstName,
  code,
}: EmailVerificaionCodeProps) => {
  return (
    <Html>
      <Head />
      <Preview>{'Sign Up Verification Code'}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-lg border border-solid border-[#e6e6e6] p-[20px]">
            <Text className="mb-2 text-base">Hi {firstName},</Text>
            <Text className="mb-8 text-base">
              To complete your Verve sign up process, use the verification code
              below
            </Text>
            <Text className="mb-2 text-base font-medium">
              Verification Code:
            </Text>

            <Text className="mb-8 w-max rounded-lg border border-solid border-[#a4a4a4] bg-[#e6e6e6] px-5 py-3 text-2xl font-medium">
              {code}
            </Text>
            <Text className="text-base">
              {`If you didn't request this,
              just ignore and delete this message.`}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
