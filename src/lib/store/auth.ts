import { create } from 'zustand';

type SignUpStoreAction = {
  setStep: (step: SignUpStore['step']) => void;
};

type SignUpStore = {
  step: 'emailAndFullname' | 'password' | 'verificationCode';
};

const initialState: SignUpStore = { step: 'password' };

export const useSignUpStore = create<SignUpStore & SignUpStoreAction>()(
  (set) => ({
    ...initialState,
    setStep: (step) => set({ step }),
  }),
);
