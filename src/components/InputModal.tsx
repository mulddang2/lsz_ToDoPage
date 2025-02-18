import React, { useState } from 'react';
import { isNullOrEmpty } from '../util/stringUtil';
import ModalBg from './ModalBg';

interface IInputModal {
  title: string;
  inputName: string;
  isOpen: boolean;
  onSubmit: (content: string) => void;
  onClose: () => void;
}

export default function InputModal({
  title,
  inputName,
  isOpen,
  onSubmit,
  onClose,
}: IInputModal) {
  const [modalContent, setModalContent] = useState('');

  const saveTodoName = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setModalContent(e.target.value);
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent
  ) => {
    e.preventDefault();
    if (isNullOrEmpty(modalContent)) {
      alert('목록을 비워둘 수 없습니다.');
      return;
    }
    onSubmit(modalContent);
    setModalContent('');
    onClose();
  };

  const handleButtonPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <ModalBg isOpen={isOpen}>
      <h2 className='text-lg font-bold mb-6'>{title}</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <label className='block text-sm mb-2'>{inputName}</label>
          <input
            autoFocus
            className='w-full px-3 py-2 border rounded-lg border-gray-200'
            name='name'
            onChange={saveTodoName}
            onKeyDown={handleButtonPress}
          />
        </div>
        <div className='flex gap-2 justify-between'>
          <button
            onClick={onClose}
            className='w-1/2 px-4 py-2 bg-white border-gray-200 border text-gray-600 font-medium rounded-lg'
          >
            취소
          </button>
          <button
            type='submit'
            className='w-1/2 px-4 py-2 bg-violet text-white rounded-lg'
          >
            확인
          </button>
        </div>
      </form>
    </ModalBg>
  );
}
