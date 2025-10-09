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

  const rightIcons = [
    { href: '#', icon: faUser },
    { href: '#', icon: faPhone },
  ];

  return (
    <header>
      <div className="container-fluid px-4 sm:px-8 py-6">
        <div className="flex flex-col xs:flex-row items-start xs:items-center xs:justify-between">
          <nav className="flex flex-wrap gap-6 mb-4 xs:mb-0 ">
            {leftIcons.map(({ href, icon, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:opacity-80"
              >
                <FontAwesomeIcon
                  icon={icon}
                  fixedWidth
                  style={{ width: '1.5rem', height: '1.5rem' }}
                />
              </a>
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
