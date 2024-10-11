'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Next.js Link bileşeni ekliyoruz
import { FaTable, FaBox, FaTachometerAlt } from 'react-icons/fa'; // İkonları ekliyoruz

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <FaTachometerAlt className="w-12 h-12 text-white" />
            <span className="mx-2 text-2xl font-semibold text-white">Dashboard</span>
          </div>
        </div>

        <nav className="mt-10">
          <Link href="/">
            <div className="flex items-center px-6 py-2 mt-4 text-gray-100 bg-gray-700 bg-opacity-25 cursor-pointer">
              <FaTachometerAlt className="w-6 h-6" />
              <span className="mx-3">Dashboard</span>
            </div>
          </Link>

          <Link href="/tables">
            <div className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100 cursor-pointer">
              <FaTable className="w-6 h-6" />
              <span className="mx-3">Tablolar</span>
            </div>
          </Link>

          <Link href="/products">
            <div className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100 cursor-pointer">
              <FaBox className="w-6 h-6" />
              <span className="mx-3">Products</span>
            </div>
          </Link>
        </nav>
      </div>
    </>
  );
}
