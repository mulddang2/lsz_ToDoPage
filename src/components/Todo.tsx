import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useBoardStore } from '../stores/useBoardStore';
import { TTodo } from '../types/todo';
import { ItemTypes } from './Board';
import Dropdown from './Dropdown';
import InputModal from './InputModal';
import { useDndStore } from '../stores/useDndStore';

interface ITodo {
  todo: TTodo;
  index: number;
  boardId: string;
}

export default function Todo({ todo, index, boardId }: ITodo) {
  const { removeTodo, editTodo, moveTodo } = useBoardStore();
  const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const { isDraggable, setIsDraggable } = useDndStore();

  useEffect(() => {
    setIsDraggable(!isEditTodoModalOpen);
  }, [setIsDraggable, isEditTodoModalOpen]);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: { boardId: boardId, todoId: todo.id, todoIndex: index },
    canDrag: isDraggable,
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

  const dropdownItems = [
    {
      text: '수정하기',
      onClick: () => setIsEditTodoModalOpen(true),
    },
    {
      text: '삭제하기',
      onClick: () => removeTodo(boardId, todo.id),
    },
  ];

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      className={`cursor-move bg-white rounded-md p-3 mt-3 flex justify-between gap-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      key={todo.id}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <h5>{todo.content}</h5>
      <div className={`${isHover ? 'visible' : 'invisible'}`}>
        <Dropdown items={dropdownItems} />
      </div>

      <InputModal
        title='변경할 할 일을 입력해주세요.'
        inputName='내용'
        inputDefaultValue={todo.content}
        isOpen={isEditTodoModalOpen}
        onClose={() => setIsEditTodoModalOpen(false)}
        onSubmit={(content: string) => editTodo(boardId, todo.id, content)}
      />
    </div>
  );
}
