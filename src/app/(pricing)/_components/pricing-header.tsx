'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faSpotify,
  faTiktok,
  faYoutube,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { faUser, faPhone } from '@fortawesome/free-solid-svg-icons';

export default function PricingHeader() {
  const leftIcons = [
    { href: '#', icon: faFacebookF },
    { href: '#', icon: faXTwitter },
    { href: '#', icon: faInstagram },
    { href: '#', icon: faSpotify },
    { href: '#', icon: faTiktok },
    { href: '#', icon: faYoutube },
    { href: '#', icon: faLinkedinIn },
  ];

  const rightIcons = [
    { href: '#', icon: faUser },
    { href: '#', icon: faPhone },
  ];

  return (
    <header>
      <div className="container-fluid px-4 sm:px-8 py-6">
        <div className="flex flex-col xs:flex-row items-start xs:items-center xs:justify-between">
          <nav className="flex flex-wrap gap-6 mb-4 xs:mb-0 ">
            {leftIcons.map(({ href, icon }, i) => (
              <Link key={i} href={href} className="hover:opacity-80">
                <FontAwesomeIcon
                  icon={icon}
                  fixedWidth
                  style={{ width: '1.5rem', height: '1.5rem' }}
                />
              </Link>
            ))}
          </nav>

          <div className="flex gap-6">
            {rightIcons.map(({ href, icon }, i) => (
              <Link key={i} href={href} className="hover:opacity-80">
                <FontAwesomeIcon
                  icon={icon}
                  fixedWidth
                  style={{ width: '1.5rem', height: '1.5rem' }}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
