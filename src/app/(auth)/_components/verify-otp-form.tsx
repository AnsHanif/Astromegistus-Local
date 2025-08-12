import React, { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthForm from './auth-form';

type Props = { onBack: () => void; onSuccess: () => void };

type VerifyOtpFormType = { otp: string[] };

export default function VerifyOtpform({ onBack, onSuccess }: Props) {
  const methods = useForm<VerifyOtpFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: { otp: ['', '', '', ''] },
  });

  const inputsRef = useRef<HTMLInputElement[]>([]);

  const onSubmit = (data: VerifyOtpFormType) => {
    const otpCode = data.otp.join('');
    console.log('OTP Entered:', otpCode);
    onSuccess();
  };

  const handleChange = (value: string, index: number) => {
    const fieldName = `otp.${index}` as const;
    methods.setValue(fieldName, value);

    // Move to next box if filled
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === 'Backspace' &&
      !methods.getValues(`otp.${index}`) &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!pastedData) return;

    const digits = pastedData.split('').slice(0, inputsRef.current.length);
    digits.forEach((digit, idx) => {
      methods.setValue(`otp.${idx}`, digit);
      if (inputsRef.current[idx]) {
        inputsRef.current[idx].value = digit; // update UI immediately
      }
    });

    // Move focus to the next empty box
    const nextEmptyIndex =
      digits.length < inputsRef.current.length
        ? digits.length
        : inputsRef.current.length - 1;
    inputsRef.current[nextEmptyIndex]?.focus();
  };

  return (
    <AuthForm
      heading="Verify OTP"
      subheading="Enter 4-digit code send to your email"
      buttonText=""
      showBackButton={true}
      onBackClick={onBack}
    >
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-8 w-full h-full max-w-[500px]"
          onSubmit={methods.handleSubmit(onSubmit)} // 👈 Hooked up here
        >
          <div className="space-y-4 w-full">
            <Label
              htmlFor="otp"
              className="block text-size-secondary md:text-size-medium font-semibold"
            >
              OTP Code
            </Label>

            <div className="flex justify-between gap-4 sm:gap-12 mt-2">
              {[0, 1, 2, 3].map((i) => {
                const { ref, ...rest } = methods.register(`otp.${i}`);
                return (
                  <Input
                    key={i}
                    {...rest}
                    ref={(el) => {
                      ref(el); // RHF's ref
                      if (el) inputsRef.current[i] = el; // our own ref
                    }}
                    type="text"
                    maxLength={1}
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    className="!w-full border border-grey h-13 md:h-15 font-sf-pro text-center text-lg"
                  />
                );
              })}
            </div>
          </div>

          <div>
            <Button
              variant="default"
              className="w-full text-black"
              type="submit"
            >
              Verify Code
            </Button>

            <div className="text-center mt-3">
              Don’t Receive It?{' '}
              <span className="text-golden-yellow hover:cursor-pointer">
                Resend Code
              </span>
            </div>
          </div>
        </form>
      </FormProvider>
    </AuthForm>
  );
}
