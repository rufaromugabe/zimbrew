"use client"
import { Menu } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="ml-auto flex items-center gap-4 sm:gap-6">
      <div className="hidden md:flex gap-4 sm:gap-6">
        <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
          Home
        </Link>
        <Link href="/products" className="text-sm font-medium hover:underline underline-offset-4">
          Shop
        </Link>
        <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
          Contact
        </Link>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-neutral-900 dark:text-neutral-50">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-14 right-0 w-full bg-white shadow-md md:hidden">
          <Link href="/" className="block px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Home
          </Link>
          <Link href="/products" className="block px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Shop
          </Link>
          <Link href="/contact" className="block px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;