import { create } from 'zustand';

type SignUpStoreAction = {
  setStep: (step: SignUpStore['step']) => void;
};

type SignUpStore = {
  step: 'emailAndFullname' | 'password' | 'verificationCode';
};

const initialState: SignUpStore = { step: 'emailAndFullname' };

export const useSignUpStore = create<SignUpStore & SignUpStoreAction>()(
  (set) => ({
    ...initialState,
    setStep: (step) => set({ step }),
  }),
);
