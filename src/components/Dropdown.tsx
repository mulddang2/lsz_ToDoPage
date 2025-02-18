import { useEffect, useRef, useState } from 'react';
import { IoIosMore } from 'react-icons/io';

interface IDropdown {
  items: Array<{ text: string; onClick: () => void }>;
}

export default function Dropdown({ items }: IDropdown) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className='relative inline-block text-left' ref={dropdownRef}>
      <div>
        <button onClick={toggleDropdown}>
          <IoIosMore />
        </button>
      </div>

      {isOpen && (
        <div
          className='origin-top-right absolute right-0 mt-2 w-24 
                rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5
                focus:outline-none z-10 '
          role='menu'
        >
          <ul className='py-1'>
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => item.onClick()}
                className='block px-4 py-2 text-sm text-gray-700 
                        hover:bg-gray-100 transition duration-300'
              >
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
