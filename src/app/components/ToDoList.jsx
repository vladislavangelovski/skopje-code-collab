import React, { useEffect, useState } from "react";
import prisma from "@prisma/client";

const ToDoList = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState("");

    const fetchTasks = async () => {
        const fetchedTasks = await prisma.task.findMany({
            where: { projectId },
        });
        setTasks(fetchedTasks);
    };

    const addTask = async () => {
        if (!taskText) return;

        const newTask = await prisma.task.create({
            data: {
                task: taskText,
                completed: false,
                projectId,
            },
        });

        setTasks((prev) => [...prev, newTask]);
        setTaskText("");
    };

    const toggleTaskCompletion = async (id) => {
        const task = tasks.find((t) => t.id === id);

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { completed: !task.completed },
        });

        setTasks((prev) =>
            prev.map((t) => (t.id === id ? updatedTask : t))
        );
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">To-Do List</h2>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter a task"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={addTask}
                    className="p-2 bg-green-500 text-white rounded"
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
                        <span className={completed ? "line-through" : ""}>{task}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ToDoList;
