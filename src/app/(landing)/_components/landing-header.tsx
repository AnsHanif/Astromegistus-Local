'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

import { logo } from '../../../components/assets';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Coaching', href: '/coaching' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
  { label: 'Career', href: '/career' },
  { label: 'Astrology News', href: '/astrology-news' },
];

export default function LandingHeader() {
  const userInfo = useSelector((state: RootState) => state.user.currentUser);
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  return (
    <header className="bg-emerald-green text-white px-4 sm:px-8 py-1 shadow-md">
      <div className="flex items-center justify-between mx-auto">
        <div className="flex items-center">
          <Image
            src={logo}
            alt="Astromegistus Logo"
            width={60}
            height={60}
            className="object-contain cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>

        <div className="hidden lg:flex items-center space-x-16">
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors font-semibold ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-[#FFFFFF66] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/shopping-cart">
              <ShoppingCart
                className={`w-4 h-4 cursor-pointer ${
                  pathname === '/shopping-cart'
                    ? 'text-white'
                    : 'text-[#FFFFFF66] hover:text-white'
                }`}
              />
            </Link>
          </nav>

          <div className="flex items-center space-x-8">
            {userInfo ? (
              <Button
                variant="default"
                className="bg-white text-emerald-green font-semibold px-4 py-2 hover:opacity-90"
                onClick={() => router.push('/dashboard/booked-readings')}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white font-semibold p-0 hover:bg-white/10"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  className="bg-white text-emerald-green font-semibold px-4 py-2 hover:opacity-90"
                  onClick={() => router.push('/auth-selection')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>

        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon
            icon={mobileMenuOpen ? faXmark : faBars}
            className="transition-transform duration-300 cursor-pointer"
            style={{ width: '1.5rem', height: '1.5rem' }}
          />
        </button>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors font-semibold block px-4 py-2 ${
                  pathname === item.href
                    ? 'text-white bg-white/10 rounded'
                    : 'text-[#FFFFFFCC] hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col space-y-4 pt-4">
            {userInfo ? (
              <Button
                variant="default"
                className="bg-white text-emerald-green font-semibold w-full px-4 py-2 hover:opacity-90"
                onClick={() => router.push('/dashboard/booked-readings')}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white font-semibold w-full py-4"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  className="bg-white text-emerald-green font-semibold w-full px-4 py-2 hover:opacity-90"
                  onClick={() => router.push('/auth-selection')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
