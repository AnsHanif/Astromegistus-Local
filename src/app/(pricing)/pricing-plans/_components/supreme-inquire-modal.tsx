'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogProps } from '@/types';
import CustomModal from '@/components/common/custom-modal';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '@/components/common/form-input';
import FormTextarea from '@/components/common/form-textarea';
import { InquiryForm } from '@/types/pricing-plans';
import { useSubmitSupremeInquiry } from '@/hooks/mutation/pricing-mutation/pricing';
import SpinnerLoader from '@/components/common/spinner-loader/spinner-loader';
import { enqueueSnackbar, closeSnackbar } from 'notistack';
import { getErrorMessage } from '@/utils/error-handler';

interface SupremeInquireModalProps extends DialogProps {}

export default function SupremeInquireModal({
  isOpen,
  onClose,
}: SupremeInquireModalProps) {
  const { mutateAsync, isPending, isError, error } = useSubmitSupremeInquiry();

  const methods = useForm<InquiryForm>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const modalStyles = {
    modal: {
      maxHeight: '650px',
      borderRadius: '1rem',
      maxWidth: '40rem',
      width: '100%',
      background: '#fff',
      padding: 0,
    },
    closeIcon: {
      fill: '#444',
    },
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const onSubmit = async (data: InquiryForm) => {
    try {
      await mutateAsync(data);
      // Optionally reset form or close modal here
      handleClose();
    } catch (error: any) {
      closeSnackbar();
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      styles={modalStyles}
      showCloseIcon={true}
    >
      <div className="flex items-center justify-center bg-[#00000066]">
        <div className="bg-white shadow-lg max-w-2xl w-full relative p-8">
          <h1 className="text-size-heading md:text-size-primary font-bold mb-2">
            Supreme Plan Inquiry
          </h1>
          <p className="text-sm font-normal mb-6">
            Please select your category and provide your details. Someone from
            our sales department will contact you shortly.
          </p>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="space-y-6 w-full max-h-[50vh] overflow-y-auto mb-6">
                {/* Interest radio group */}
                <div>
                  <p className="text-size-heading font-semibold mb-2">
                    I Am Interested In:
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value="business"
                        {...methods.register('category', {
                          required: 'Please select your interest',
                        })}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="font-semibold">
                        Business &amp; Organizations
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value="exclusive"
                        {...methods.register('category', {
                          required: 'Please select your interest',
                        })}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="font-semibold">Exclusive</span>
                    </label>
                  </div>
                  {methods.formState.errors.category && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.category.message}
                    </p>
                  )}
                </div>

                {/* Name */}
                <FormInput
                  label="Name"
                  name="name"
                  placeholder="Preston Kunde"
                  rules={{
                    required: 'Name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters long.',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Name must be at most 100 characters long.',
                    },
                  }}
                  className="w-full border-black placeholder:text-[#333333] px-5 border-[1px] focus:border-black focus:ring-0 focus:outline-none"
                />

                {/* Phone Number */}
                <FormInput
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="123456789"
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{7,15}$/,
                      message: 'Phone number must be 7–15 digits',
                    },
                  }}
                  className="w-full border-black placeholder:text-[#333333] px-5 border-[1px] focus:border-black focus:ring-0 focus:outline-none"
                />

                {/* Statement */}
                <FormTextarea
                  label="Brief Statement"
                  name="statement"
                  placeholder="Tell us more..."
                  rules={{
                    required: 'Statement is required',
                    minLength: {
                      value: 10,
                      message: 'Statement must be at least 10 characters long.',
                    },
                  }}
                  className="w-full text-base border-black placeholder:text-[#333333] px-5 py-4 border-[1px] focus:border-black focus:ring-0 focus:outline-none rounded-none h-35"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-12 border-emerald-green md:h-15 md:w-[328px] bg-emerald-green hover:bg-emerald-green/95 text-white"
                >
                  {isPending ? <SpinnerLoader /> : 'Submit Inquiry'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </CustomModal>
  );
}
