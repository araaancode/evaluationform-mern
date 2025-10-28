// src/contexts/BrandContext.js
import React, { createContext, useState } from 'react';

export const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState('brand1');

  const brands = [
    {
      id: 'brand1',
      name: 'فرامهاجرت',
      phone: '021-12345678',
      email: 'info@faramohajerat.ir',
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      description: 'مشاوره تخصصی مهاجرت تحصیلی و کاری',
      colors: {
        primary: '#8B0000',
        secondary: '#B22222'
      }
    },
    {
      id: 'brand2',
      name: 'مهاجرپلاس',
      phone: '021-87654321',
      email: 'info@mohajerplus.ir',
      address: 'تهران، میدان ونک، برج سپهر',
      description: 'خدمات کامل مهاجرت و اعزام دانشجو',
      colors: {
        primary: '#2E8B57',
        secondary: '#3CB371'
      }
    },
    {
      id: 'brand3',
      name: 'ویزا724',
      phone: '021-55556666',
      email: 'info@visa724.ir',
      address: 'اصفهان، خیابان چهارباغ',
      description: 'اخذ ویزاهای شنگن و آمریکا',
      colors: {
        primary: '#1E90FF',
        secondary: '#87CEFA'
      }
    }
  ];

  const value = {
    currentBrand,
    setCurrentBrand,
    brands,
    currentBrandData: brands.find(brand => brand.id === currentBrand)
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};