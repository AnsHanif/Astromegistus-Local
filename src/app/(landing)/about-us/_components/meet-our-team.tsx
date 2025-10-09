import React from 'react';
import Image from 'next/image';
import { Member1, Member2, Member3 } from '@/components/assets';

const team = [
  {
    name: 'Tricia Oberbrunner',
    role: 'Senior Infrastructure Planner',
    desc: 'Lorem ipsum dolor sit amet consectetur. Sit adipiscing tortor dictum turpis ipsum. Et leo phasellus etiam sed. Ipsum at mus arcu tellus. nunc nullam diam facilisis arcu enim egestas elementum. Iaculis vitae consectetur morbi orci luctus placerat donec pulvinar dolor. Enim est molestie fermentum porttitor dolor. Tempor tort consequat nibh risus vivamus duis.',
    image: Member1,
  },
  {
    name: 'Esther Rowe',
    role: 'Product Metrics Producer',
    image: Member2,
  },
  {
    name: 'Matthew Sawayn',
    role: 'National Accounts Representative',
    image: Member3,
  },
];

export default function MeetOurTeam() {
  return (
    <div className="px-4 sm:px-12 py-16">
      <h2 className="text-5xl text-center font-bold mb-2">
        Meet the Team
      </h2>
      <p className="text-base font-normal max-w-[700px] mx-auto text-center mb-8">
        Our astrologers and coaches are carefully selected, trained, and vetted
        for both knowledge and integrity. Whether you seek a natal chart
        reading, relationship insight, or life coaching, you're in good hands.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <div
            key={index}
            className="relative group overflow-hidden shadow-lg text-white"
          >
            <Image
              src={member.image}
              alt={member.name}
              width={400}
              height={500}
              className={`object-cover w-full h-[500px] ${
                index === 0 ? 'object-top' :
                index === 1 ? 'object-top' :
                'object-center'
              }`}
            />
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="bg-gradient-to-t from-[#000000] via-black/70 to-transparent p-4">
                <div className="pl-3 border-l-2 border-white">
                  <h3 className="font-semibold text-xl md:text-2xl">
                    {member.name}
                  </h3>
                  <p className="text-sm font-normal">{member.role}</p>
                  {member.desc && (
                    <p className="text-base font-normal mt-5">
                      {member.desc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
