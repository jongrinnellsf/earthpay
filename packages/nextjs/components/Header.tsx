"use client";

import React from "react";
import Link from "next/link";
import { ConnectButton } from "~~/components/scaffold-alchemy";

/**
 * Simplified EarthPass header
 */
export const Header = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="font-bold text-xl bg-gradient-to-r from-[#363FF9] to-[#5498FF] bg-clip-text text-transparent">
              EarthPay
            </div>
          </Link>

          {/* Connect Button */}
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};
