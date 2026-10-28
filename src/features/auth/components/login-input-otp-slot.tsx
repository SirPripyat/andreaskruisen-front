import { InputOTPSlot } from '@/components/ui';

type LoginInputOtpSlotProps = {
  index: number;
};

export const LoginInputOtpSlot = ({ index }: LoginInputOtpSlotProps) => {
  return (
    <InputOTPSlot
      index={index}
      className={'size-12 font-mono text-lg w-full'}
    />
  );
};
