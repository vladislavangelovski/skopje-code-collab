"use client";
import React, { useState } from 'react';

const ToDoList = ({ tasks, addTask, toggleTaskCompletion }) => {
    const [task, setTask] = useState('');

    const handleAddTask = () => {
        if (task) {
            addTask(task);
            setTask('');
        }
    };

    return (
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">To-Do List</h2>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter a task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={handleAddTask}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Add
                </button>
            </div>
            <ul className="mt-4">
                {tasks.map(({ id, task, completed }) => (
                    <li key={id} className="py-2 border-b flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => toggleTaskCompletion(id)}
                        />
                        <span className={completed ? 'line-through' : ''}>{task}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ToDoList;
