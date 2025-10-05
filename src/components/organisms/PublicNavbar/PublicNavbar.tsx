'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/atoms/ThemeToggle';
import Button from '@/components/atoms/Button';
import { MenuIcon, CloseIcon } from '@/components/icons';
import './index.css';

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`public-navbar ${isScrolled ? 'scrolled' : ''}`}>
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

          {/* Desktop Menu */}
          <div className="navbar-menu">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/courses" className="nav-link">Courses</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            <div className="desktop-actions">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" size="sm">Get Started Free</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <ThemeToggle />
            </div>
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
          </div>
        </>
      )}
    </nav>
  );
}
