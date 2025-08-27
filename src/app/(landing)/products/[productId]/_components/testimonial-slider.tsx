// components/TestimonialSlider.tsx
'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiper-slider.css';
import { useEffect, useRef } from 'react';
import ArrowPrev from '@/components/assets/svg-icons/arrow-prev';
import ArrowNext from '@/components/assets/svg-icons/arrow-next';

const testimonials = [
  {
    name: 'Tyrone Abshire',
    role: 'Entrepreneur',
    image: '/product-card-2.png',
    text: 'Lorem ipsum dolor sit amet consectetur. Amet feugiat cras neque semper enim turpis. Dapibus massa massa nec nulla et odio lorem ante integer. Quisque amet morbi imperdiet semper elit vel. At venenatis felis.',
  },
  {
    name: 'Jane Doe',
    role: 'Designer',
    image: '/product-card-7.png',
    text: 'Lorem ipsum dolor sit amet consectetur. Amet feugiat cras neque semper enim turpis. Dapibus massa massa nec nulla et odio lorem ante integer. Quisque amet morbi imperdiet semper elit vel. At venenatis felis.',
  },
  {
    name: 'John Smith',
    role: 'Developer',
    image: '/product-card-4.png',
    text: 'Lorem ipsum dolor sit amet consectetur. Amet feugiat cras neque semper enim turpis. Dapibus massa massa nec nulla et odio lorem ante integer. Quisque amet morbi imperdiet semper elit vel. At venenatis felis.',
  },
  {
    name: 'Test User',
    role: 'Developer',
    image: '/product-card-5.png',
    text: 'Lorem ipsum dolor sit amet consectetur. Amet feugiat cras neque semper enim turpis. Dapibus massa massa nec nulla et odio lorem ante integer. Quisque amet morbi imperdiet semper elit vel. At venenatis felis.',
  },
  {
    name: 'John Smith',
    role: 'Developer',
    image: '/product-card-6.png',
    text: 'Lorem ipsum dolor sit amet consectetur. Amet feugiat cras neque semper enim turpis. Dapibus massa massa nec nulla et odio lorem ante integer. Quisque amet morbi imperdiet semper elit vel. At venenatis felis.',
  },
];

export default function TestimonialSlider() {
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update(); // force recalc on mount
    }
  }, []);

  return (
    <div className="w-full relative py-4 md:py-6">
      <h2 className="text-size-heading md:text-size-primary font-bold text-center mb-2">
        Real Insights, Real Transformation
      </h2>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        pagination={{ clickable: true }}
        className="!py-[40px]"
        navigation={{
          prevEl: '.custom-prev',
          nextEl: '.custom-next',
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1.2, // peek a bit of the next card
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="bg-white py-10 px-6 text-center cursor-pointer"
              style={{
                boxShadow: '0 0 50px 2px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex justify-center mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover max-w-[5rem] max-h-[5rem] w-full h-[80px]"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-sm text-grey mb-6">{item.role}</p>
              <p className="text-sm">{item.text}</p>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom buttons */}
        <div className="custom-prev absolute top-1/2 left-4 -translate-y-1/2 z-10 cursor-pointer">
          <ArrowPrev />
        </div>

        <div className="custom-next absolute top-1/2 right-4 -translate-y-1/2 z-10 cursor-pointer">
          <ArrowNext />
        </div>
      </Swiper>
    </div>
  );
}
