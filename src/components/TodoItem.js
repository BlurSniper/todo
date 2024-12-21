import { format } from 'date-fns';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import styles from '../styles/modules/todoItem.module.scss';
import { getClasses } from '../utils/getClasses';
import TodoModal from './TodoModal';
import { useTodoContext } from '../context/TodoContext';
import { deleteTodo, updateTodo } from '../api/todos';

const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function TodoItem({ todo }) {
  const dispatch = useDispatch();
  const { refreshTodos } = useTodoContext();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // Handle delete action
  const handleDelete = async (id) => {
    await deleteTodo(id);
    toast.success('Todo Deleted Successfully');
    refreshTodos();
  };

  // Handle update action
  const handleUpdate = () => {
    setUpdateModalOpen(true);
  };

  // Function to handle keydown events for accessibility
  const handleKeyDown = (event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      callback();
    }
  };

  return (
    <>
      <motion.div className={styles.item} variants={child}>
        <div className={styles.todoDetails}>
          <div className={styles.texts}>
            <p
              className={getClasses([
                styles.todoText,
                todo.status === 'complete' && styles['todoText--completed'],
              ])}
            >
              {todo.title}
            </p>
            <p className={styles.time}>
              {format(new Date(todo.time), 'p, MM/dd/yyyy')}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100px',
            height: '30px',
            backgroundColor: '#e0e0df',
            borderRadius: '5px',
            marginBottom: '8px',
            position: 'relative', // Positioning for progress text inside the bar
          }}
        >
          {/* Progress fill */}
          <div
            style={{
              height: '100%',
              width: `${todo.progress}px`,
              backgroundColor: '#3b82f6',
              borderRadius: '5px',
            }}
          >
            {/* Progress Text */}
            <div
              className={styles.progressText}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              {todo.progress}%
            </div>
          </div>
        </div>

        <div className={styles.todoActions}>
          {/* Delete button with keyboard accessibility */}
          <div
            className={styles.icon}
            onClick={() => handleDelete(todo.id)}
            onKeyDown={(e) => handleKeyDown(e, () => handleDelete(todo.id))}
            tabIndex={0}
            role="button"
            aria-label="Delete Todo"
          >
            <MdDelete />
          </div>

          {/* Edit button with keyboard accessibility */}
          <div
            className={styles.icon}
            onClick={() => handleUpdate()}
            onKeyDown={(e) => handleKeyDown(e, handleUpdate)}
            tabIndex={0}
            role="button"
            aria-label="Edit Todo"
          >
            <MdEdit />
          </div>
        </div>
      </motion.div>

      {/* Update Modal */}
      <TodoModal
        type="update"
        modalOpen={updateModalOpen}
        setModalOpen={setUpdateModalOpen}
        todo={todo}
      />
    </>
  );
}

export default TodoItem;
