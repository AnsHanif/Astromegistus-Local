import React from 'react';

export default function CountSection() {
  const stats = [
    { value: '50,000+', label: 'Sessions Delivered' },
    { value: '4.9/5', label: 'Average Rating' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <div className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark min-h-80 px-4 sm:px-12 py-12 flex item-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center gap-2 text-center"
          >
            <h1 className="text-size-primary md:text-size-heading-xl font-bold">
              {stat.value}
            </h1>
            <p className="text-size-heading md:text-size-primary font-bold">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
