'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/atoms/ThemeToggle';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import { MenuIcon, CloseIcon } from '@/components/icons';
import './index.css';

export interface PublicNavbarProps {
  isAuthenticated?: boolean;
  showSearch?: boolean;
  transparent?: boolean;
}

export default function PublicNavbar({ 
  isAuthenticated = false, 
  showSearch = false,
  transparent = false 
}: PublicNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClass = `public-navbar ${isScrolled ? 'scrolled' : ''} ${transparent && !isScrolled ? 'transparent' : ''}`;

  return (
    <nav className={navbarClass}>
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <div className="logo-wrapper">
              <Image
                src="/images/logo.jpg"
                alt="Ashravi Logo"
                width={150}
                height={50}
                className="logo-image"
                priority
              />
            </div>
          </Link>

          {/* Search Bar (Desktop - Only on Homepage when authenticated) */}
          {showSearch && (
            <div className="navbar-search desktop-search">
              <SearchBar placeholder="Search for parenting courses..." />
            </div>
          )}

          {/* Desktop Menu */}
          <div className="navbar-menu">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/courses" className="nav-link">Courses</Link>
            {isAuthenticated && (
              <Link href="/children" className="nav-link">Children</Link>
            )}
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            <div className="desktop-actions">
              <ThemeToggle />
              {!isAuthenticated && (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="primary" size="sm">Get Started Free</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions - Theme Toggle + Menu Button */}
            <div className="mobile-actions">
              <ThemeToggle />
              <button
                className="mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <CloseIcon className="menu-icon" />
                ) : (
                  <MenuIcon className="menu-icon" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (Mobile - Below navbar) */}
        {showSearch && (
          <div className="navbar-search mobile-search">
            <SearchBar placeholder="Search courses..." />
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="mobile-menu">
            <div className="mobile-menu-links">
              <Link 
                href="/" 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/courses" 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/children" 
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Children
                </Link>
              )}
              <Link 
                href="/about" 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
            {!isAuthenticated && (
              <div className="mobile-menu-actions">
                <Link 
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" size="md" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link 
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="primary" size="md" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
