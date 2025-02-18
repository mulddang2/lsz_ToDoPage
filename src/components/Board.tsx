import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IoTrashBinOutline } from 'react-icons/io5';
import { MdOutlineAddBox, MdOutlineEdit } from 'react-icons/md';
import { useBoardStore } from '../stores/useBoardStore';
import { TBoard } from '../types/board';
import InputModal from './InputModal';
import Todo from './Todo';

interface BoardProps {
  index: number;
  board: TBoard;
}

export const ItemTypes = {
  BOARD: 'board',
  TODO: 'todo',
};

export default function Board({ board, index }: BoardProps) {
  const { addTodo, removeBoard, editBoard, moveBoard } = useBoardStore();
  const [isCreateTodoModalOpen, setIsCreateTodoModalOpen] = useState(false);

  const handleDeleteBoard = (boardId: string) => {
    removeBoard(boardId);
  };

  const handleEditBoard = (boardId: string) => {
    const newName = prompt('변경할 보드 이름을 입력해주세요.');
    if (newName === null) {
      return;
    } else if (newName.trim() === '') {
      alert('보드 이름을 여백으로 변경할 수 없습니다.');
      return;
    }
    editBoard(boardId, newName);
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOARD,
    item: { boardId: board.id, boardIndex: index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.BOARD,
    drop: (dragItem: { boardId: string; boardIndex: number }) => {
      if (dragItem.boardId !== board.id) {
        moveBoard(dragItem.boardId, index);
        dragItem.boardId = board.id;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      key={board.id}
      className={`cursor-move bg-gray-100 p-3 w-96 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <h4 className='flex justify-between items-center'>
        <span className='text-2xl text-gray-600 font-bold'>{board.name}</span>
        <div className='flex gap-2'>
          <MdOutlineEdit
            onClick={() => handleEditBoard(board.id)}
            className='w-8 h-8 text-gray-500 cursor-pointer'
          />
          <IoTrashBinOutline
            onClick={() => handleDeleteBoard(board.id)}
            className='w-8 h-8 text-gray-500 cursor-pointer'
          />
        </div>
      </h4>
      {board.todos.map((todo, index) => (
        <Todo key={index} todo={todo} index={index} boardId={board.id} />
      ))}

      <button
        onClick={() => {
          setIsCreateTodoModalOpen(true);
        }}
        className='flex justify-center items-center mt-6 space-x-2 text-lg'
      >
        <span>Add task</span>
        <MdOutlineAddBox className='w-5 h-5 text-gray-500' />
      </button>
      <InputModal
        title='새로운 목록 생성'
        inputName='내용'
        isOpen={isCreateTodoModalOpen}
        onClose={() => setIsCreateTodoModalOpen(false)}
        onSubmit={(content: string) => addTodo(board.id, content)}
      />
    </div>
  );
}
