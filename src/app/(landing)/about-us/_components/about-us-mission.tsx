'use client';

import Image from 'next/image';
import { AboutMissionBG, AboutMissionImg } from '@/components/assets';

export default function AboutUsMission() {
  return (
    <div
      className="min-h-[650px] bg-no-repeat bg-center text-white grid grid-cols-1 md:grid-cols-2 gap-12 px-4 sm:px-12 pb-12 pt-20 md:pt-14 md:pb-0"
      style={{
        backgroundImage: `url(${AboutMissionBG.src})`,
        backgroundSize: '100% 100%',
      }}
    >
      <div className="flex items-center justify-center">
        <Image
          src={AboutMissionImg}
          alt="Astrology Illustration"
          width={435}
          height={435}
          className="object-contain"
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="max-w-[500px] space-y-8 text-center md:text-left">
          <h1 className="text-5xl font-bold">
            Our Mission
          </h1>
          <p className="text-base font-normal">
            Lorem ipsum dolor sit amet consectetur. Facilisis neque sodales non
            egestas. Habitasse odio nam turpis metus massa amet hac aliquam
            orci. Nunc dignissim est quis adipiscing morbi elementum eget est
            tincidunt. Eget aliquam facilisi tellus donec a nunc sit leo.
            Ullamcorper id vivamus nullam tincidunt venenatis amet. Semper sit
            senectus scelerisque bibendum sed.
          </p>
          <p className="text-base font-normal">
            Eeu sociis facilisi vitae sodales egestas vestibulum iaculis
            pellentesque. Urna eu elementum ac nec dui amet curabitur sit. Eget
            elit mi eu in arcu nisl vitae mauris placerat. Ut fringilla semper
            elit ultricies phasellus. Tortor commodo suspendisse ut amet.
            Elementum condimentum risus in etiam consequat faucibus gravida
            vitae dolor. Enim non at tincidunt lacus. Ac aliquam suscipit lectus
            arcu vitae pharetra. Scelerisque scelerisque nulla vel eget enim
            pulvinar pretium.
          </p>
        </div>
      </div>
    </div>
  );
}
