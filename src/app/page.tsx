'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MdOutlineAddBox } from 'react-icons/md';
import Board from '../components/Board';
import InputModal from '../components/InputModal';
import { useBoardStore } from '../stores/useBoardStore';

export default function Home() {
  const { boardList, addBoard } = useBoardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='p-10 min-h-screen'>
      {/* Board header */}
      <div className='flex items-center gap-2'>
        <h4 className='text-4xl font-bold text-gray-600'>My board</h4>
        <MdOutlineAddBox
          onClick={() => setIsModalOpen(true)}
          className='w-10 h-10 text-gray-500 cursor-pointer'
        />
        <InputModal
          title='새로운 보드 생성'
          inputName='이름'
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(value) => addBoard(value)}
        />
      </div>

      {/* Board columns */}
      <div className='flex gap-5 my-5 flex-wrap'>
        <DndProvider backend={HTML5Backend}>
          {boardList.map((board, index) => (
            <Board key={board.id} board={board} index={index} />
          ))}
        </DndProvider>
      </div>
    </div>
  );
}
