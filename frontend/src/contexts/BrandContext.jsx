import React, { createContext, useState } from 'react';

export const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState('azmoonland');

  const brands = [
    {
      id: 'azmoonland',
      name: 'آزمون لند',
      phone: '021-12345671',
      email: 'info@azmoonland.ir',
      address: 'تهران، خیابان انقلاب، پلاک ۱۲۳',
      description: 'سامانه تخصصی آزمون و ارزیابی آنلاین',
      colors: {
        primary: '#8B0000',
        secondary: '#B22222'
      }
    },
    {
      id: 'faramohajerat',
      name: 'فرامهاجرت',
      phone: '021-12345672',
      email: 'info@faramohajerat.ir',
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۴',
      description: 'مشاوره تخصصی مهاجرت تحصیلی و کاری',
      colors: {
        primary: '#2E8B57',
        secondary: '#3CB371'
      }
    },
    {
      id: 'khodjosh',
      name: 'خودجوش',
      phone: '021-12345673',
      email: 'info@khodjosh.ir',
      address: 'تهران، میدان ونک، برج سپهر',
      description: 'پلتفرم توسعه فردی و مهارت‌آموزی',
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