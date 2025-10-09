'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faTiktok,
  faYoutube,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/navigation';

import { logo } from '../assets';

export default function Footer() {
  const router = useRouter();
  const icons = [
    {
      href: 'https://www.facebook.com/theastromegist',
      icon: faFacebookF,
      label: 'Facebook',
    },
    {
      href: 'https://x.com/theastromegist',
      icon: faXTwitter,
      label: 'X',
    },
    {
      href: 'https://www.instagram.com/theastromegist',
      icon: faInstagram,
      label: 'Instagram',
    },
    {
      href: 'https://www.tiktok.com/@theastromegist',
      icon: faTiktok,
      label: 'TikTok',
    },
    {
      href: 'https://www.youtube.com/@theastromegist',
      icon: faYoutube,
      label: 'YouTube',
    },
    {
      href: 'https://www.linkedin.com/company/theastromegist',
      icon: faLinkedinIn,
      label: 'LinkedIn',
    },
  ];

  return (
    <footer
      className="text-black"
      style={{
        background:
          'linear-gradient(90deg, #D9B40E 0%, #F3DD71 50%, #AB6A1C 100%)',
      }}
    >
      <div className="container-fluid px-4 sm:px-8">
        <div className="flex justify-center py-10">
          <div className="w-24 h-24">
            <Image
              src={logo}
              alt="Astromegistus Logo"
              width={96}
              height={96}
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => router.push('/')}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start mb-5">
          <div
            className="
              grid grid-cols-1 md:grid-cols-3 
              gap-16 lg:gap-24 
              mb-12 lg:mb-0
              w-full lg:w-1/2      
              pl-0 lg:pl-8
            "
          >
            <div className="space-y-8">
              <Link className="block hover:underline font-medium" href="/">
                Home
              </Link>
              <Link
                className="block hover:underline font-medium"
                href="/products"
              >
                Products
              </Link>
              <Link
                className="block hover:underline font-medium"
                href="/career"
              >
                Career
              </Link>
            </div>
            <div className="space-y-8">
              <Link
                className="block hover:underline font-medium"
                href="/contact"
              >
                Contact Us
              </Link>
              <Link
                className="block hover:underline font-medium"
                href="/about-us"
              >
                About Us
              </Link>
              <Link
                className="block hover:underline font-medium"
                href="/astrology-news"
              >
                Astrology News
              </Link>
            </div>
            <div className="space-y-8">
              <Link className="block hover:underline font-medium" href="/login">
                Login
              </Link>
            </div>
          </div>

          <div
            className="
              flex flex-wrap gap-8 
              w-full lg:w-1/2       
              pr-0 lg:pr-8
              justify-center lg:justify-end
            "
          >
            {icons.map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <FontAwesomeIcon
                  icon={icon}
                  fixedWidth
                  style={{ width: '1.5rem', height: '1.5rem' }}
                />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>

        <hr className="border-t border-black" />

        <div className="text-center py-3.5">
          <p className="font-medium">
            © 2025 Astromegistus. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
