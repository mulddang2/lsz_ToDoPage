import React from 'react';

interface IModalBg {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export default function ModalBg({ isOpen, children }: IModalBg) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 flex items-center
    justify-center bg-black bg-opacity-50'
    >
      <div
        className='bg-white rounded-lg
        shadow-lg p-6 max-w-md
        w-full relative'
      >
        {children}
      </div>
    </div>
  );
}
