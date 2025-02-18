import React from 'react';
import { TTodo } from '../types/todo';
import { MdOutlineCancelPresentation, MdOutlineEdit } from 'react-icons/md';
import { useBoardStore } from '../stores/useBoardStore';
import { ItemTypes } from './Board';
import { useDrag, useDrop } from 'react-dnd';
import { isNullOrEmpty } from '../util/stringUtil';

interface ITodo {
  todo: TTodo;
  index: number;
  boardId: string;
}

export default function Todo({ todo, index, boardId }: ITodo) {
  const { removeTodo, editTodo, moveTodo } = useBoardStore();

  const handleEditTodo = (boardId: string, todoId: string) => {
    const newContent = prompt('변경할 할 일을 입력해주세요.') || '';
    if (isNullOrEmpty(newContent)) {
      alert('할 일을 여백으로 변경할 수 없습니다.');
      return;
    }
    editTodo(boardId, todoId, newContent);
  };

  const handleDeleteTodo = (boardId: string, todoId: string) => {
    removeTodo(boardId, todoId);
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: { boardId: boardId, todoId: todo.id, todoIndex: index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TODO,
    drop: (dragItem: {
      boardId: string;
      todoId: string;
      todoIndex: number;
    }) => {
      if (dragItem.todoId !== todo.id) {
        moveTodo(dragItem.boardId, boardId, dragItem.todoId, index);
        dragItem.todoId = todo.id;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      className={` cursor-move bg-white rounded-md p-3 mt-3 flex ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      key={todo.id}
    >
      <h5>{todo.content}</h5>
      <div className='flex gap-2 '>
        <MdOutlineEdit
          onClick={() => handleEditTodo(boardId, todo.id)}
          className='w-4 h-4 text-gray-500 cursor-pointer'
        />
        <MdOutlineCancelPresentation
          onClick={() => handleDeleteTodo(boardId, todo.id)}
          className='w-4 h-4 text-gray-500 cursor-pointer'
        />
      </div>
    </div>
  );
}
