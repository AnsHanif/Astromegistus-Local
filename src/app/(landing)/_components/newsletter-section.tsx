import React from 'react';
import { NewsLetterBG } from '@/components/assets';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsLetterSection() {
  return (
    <div
      className="min-h-[300px] bg-cover bg-center text-white px-4 sm:px-8 flex flex-col items-center justify-center text-center gap-4 py-12 sm:py-0"
      style={{ backgroundImage: `url(${NewsLetterBG.src})` }}
    >
      <p className="font-semibold md:text-size-medium">
        Supreme Plan (Coming 2026)
      </p>
      <h1 className="text-size-heading md:text-size-primary font-bold max-w-3xl leading-tight">
        Be The First To Know When Supreme Launches — And Get An Exclusive Early
        Bird Discount!
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mt-5 w-full md:w-[700px]">
        <Input
          className="w-full border-white bg-white/10 placeholder:text-[#e5e5e5] text-white px-5 border-[1px] focus:border-white focus:ring-0 focus:outline-none"
          placeholder="Enter Your Email Address..."
        />
        <Button variant="default" className="w-full md:w-40 text-black">
          Notify Me
        </Button>
      </div>
    </div>
  );
}
