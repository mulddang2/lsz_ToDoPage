import { useDrag, useDrop } from 'react-dnd';
import { IoTrashBinOutline } from 'react-icons/io5';
import { MdOutlineAddBox, MdOutlineEdit } from 'react-icons/md';
import { useBoardStore } from '../stores/useBoardStore';
import { TBoard } from '../types/board';
import Todo from './Todo';
import { isNullOrEmpty } from '../util/stringUtil';

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

  const handleCreateTodo = (boardId: string) => {
    const content = prompt('할 일을 입력해주세요.') || '';
    if (isNullOrEmpty(content)) {
      alert('할 일을 비워둘 수 없습니다.');
      return;
    }
    addTodo(boardId, content);
  };

  const handleDeleteBoard = (boardId: string) => {
    removeBoard(boardId);
  };

  const handleEditBoard = (boardId: string) => {
    const newName = prompt('변경할 보드 이름을 입력해주세요.') || '';
    if (isNullOrEmpty(newName)) {
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
          handleCreateTodo(board.id);
        }}
        className='flex justify-center items-center mt-6 space-x-2 text-lg'
      >
        <span>Add task</span>
        <MdOutlineAddBox className='w-5 h-5 text-gray-500' />
      </button>
    </div>
  );
}
