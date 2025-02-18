import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { MdOutlineAddBox } from 'react-icons/md';
import { useBoardStore } from '../stores/useBoardStore';
import { TBoard } from '../types/board';
import Dropdown from './Dropdown';
import InputModal from './InputModal';
import Todo from './Todo';
import { useDndStore } from '../stores/useDndStore';

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
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const { isDraggable, setIsDraggable } = useDndStore();

  useEffect(() => {
    setIsDraggable(!isCreateTodoModalOpen && !isEditBoardModalOpen);
  }, [setIsDraggable, isCreateTodoModalOpen, isEditBoardModalOpen]);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOARD,
    item: { boardId: board.id, boardIndex: index },
    canDrag: isDraggable,
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

  const dropdownItems = [
    {
      text: '수정하기',
      onClick: () => setIsEditBoardModalOpen(true),
    },
    {
      text: '삭제하기',
      onClick: () => removeBoard(board.id),
    },
  ];

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      key={board.id}
      className={`cursor-move grid grid-rows-[auto_1fr_auto] bg-gray-100 p-3 w-96 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <h4 className='flex justify-between items-center'>
        <span
          className='text-2xl line-clamp-1 text-gray-600 font-bold'
          title={board.name}
        >
          {board.name}
        </span>
        <div className='flex gap-2'>
          <Dropdown items={dropdownItems} />
        </div>
      </h4>
      <div className='overflow-y-auto'>
        {board.todos.map((todo, index) => (
          <Todo key={index} todo={todo} index={index} boardId={board.id} />
        ))}
      </div>

      <button
        onClick={() => {
          setIsCreateTodoModalOpen(true);
        }}
        className='flex justify-center items-center space-x-2 text-lg mt-6'
      >
        <span>할 일 추가하기</span>
        <MdOutlineAddBox className='w-5 h-5 text-gray-500' />
      </button>
      <InputModal
        title='새로운 할 일을 입력해주세요.'
        inputName='내용'
        isOpen={isCreateTodoModalOpen}
        onClose={() => setIsCreateTodoModalOpen(false)}
        onSubmit={(content: string) => addTodo(board.id, content)}
      />
      <InputModal
        title='변경할 보드 이름을 입력해주세요.'
        inputName='이름'
        inputDefaultValue={board.name}
        isOpen={isEditBoardModalOpen}
        onClose={() => setIsEditBoardModalOpen(false)}
        onSubmit={(content: string) => editBoard(board.id, content)}
      />
    </div>
  );
}
