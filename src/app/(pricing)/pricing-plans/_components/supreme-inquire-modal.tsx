'use client';
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SupremeInquireModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!open) return null;
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000066]">
          <div
            className="bg-white shadow-lg max-w-2xl w-full relative p-8"
            style={{ borderRadius: '50px' }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-8 text-black cursor-pointer"
            >
              <X size={24} />
            </button>

            <h1 className="text-size-heading md:text-size-primary font-bold mb-2">
              Supreme Plan Inquiry
            </h1>
            <p className="text-base font-normal mb-6">
              Please select your category and provide your details. Someone from
              our sales department will contact you shortly.
            </p>

            <form className="space-y-6 w-full max-h-[50vh] overflow-y-auto mb-6">
              <div>
                <p className="text-size-heading font-semibold mb-2">
                  I Am Interested In:
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="interest" className="w-5 h-5" />
                    <span className="font-semibold">
                      Business &amp; Organizations
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="interest" className="w-5 h-5" />
                    <span className="font-semibold">Exclusive</span>
                  </label>
                </div>
              </div>

              <div>
                <Label className="block text-base font-semibold mb-2">
                  Name
                </Label>

                <Input
                  className="w-full border-black placeholder:text-[#333333] px-5 border-[1px] focus:border-black focus:ring-0 focus:outline-none"
                  placeholder="Preston Kunde"
                />
              </div>

              <div>
                <Label className="block text-base font-semibold mb-2">
                  Phone Number
                </Label>

                <Input
                  className="w-full border-black placeholder:text-[#333333] px-5 border-[1px] focus:border-black focus:ring-0 focus:outline-none"
                  placeholder="123456789"
                />
              </div>

              <div>
                <Label className="block text-base font-semibold mb-2">
                  Brief Statement
                </Label>

                <Textarea
                  className="w-full text-base border-black placeholder:text-[#333333] px-5 py-4 border-[1px] focus:border-black focus:ring-0 focus:outline-none rounded-none h-35"
                  placeholder="Tell us more..."
                />
              </div>
            </form>

            <div className="flex items-center justify-center">
              <Button
                variant="default"
                className="w-full md:w-[328px] bg-emerald-green text-white"
              >
                Submit Inquiry
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
