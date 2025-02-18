'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { MdOutlineAddBox } from 'react-icons/md';
import Board from '../components/Board';
import { useBoardStore } from '../stores/useBoardStore';
import { isNullOrEmpty } from '../util/stringUtil';

export default function Home() {
  const { boardList, addBoard } = useBoardStore();

  const handleCreateBoard = () => {
    const name = prompt('보드 이름을 입력해주세요.') || '';
    if (isNullOrEmpty(name)) {
      alert('보드명을 비워둘 수 없습니다.');
      return;
    }
    addBoard(name);
  };

  return (
    <div className='p-10 min-h-screen'>
      {/* Board header */}
      <div className='flex items-center gap-2'>
        <h4 className='text-4xl font-bold text-gray-600'>My board</h4>
        <MdOutlineAddBox
          onClick={handleCreateBoard}
          className='w-10 h-10 text-gray-500'
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
