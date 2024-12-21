"use client";
import React, { useState } from "react";
import DarkModeToggle from "@/app/components/DarkModeToggle";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import RootLayout from "@/app/layout";

const supabase = createClient(
    "https://qxqtexexyddetbaakplu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4cXRleGV4eWRkZXRiYWFrcGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NzQxMjgsImV4cCI6MjA1MDM1MDEyOH0.x2ddzmxImqS_H2jy7nPA41R0ExdLbfTyPxses6YLXLo"
);

const Home = () => {
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [links, setLinks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState("");
    const [linkText, setLinkText] = useState("");

    const handleFileUpload = async (acceptedFiles) => {
        const uploadedFiles = await Promise.all(
            acceptedFiles.map(async (file) => {
                const { data, error } = await supabase.storage
                    .from("uploads")
                    .upload(`uploaded-files/${file.name}`, file);

                if (error) {
                    console.error("File upload error:", error.message);
                    return null;
                }

                const { data: publicUrlData, error: urlError } = supabase.storage
                    .from("uploads")
                    .getPublicUrl(`uploaded-files/${file.name}`);

                if (urlError) {
                    console.error("Error generating public URL:", urlError.message);
                    return null;
                }

                console.log("URL: " + publicUrlData.publicUrl);

                return { id: uuidv4(), name: file.name, url: publicUrlData.publicUrl};
            })
        );
        setFiles((prev) => [...prev, ...uploadedFiles.filter(Boolean)]);
    };

    const addLink = () => {
        if (!linkText) return;
        setLinks((prev) => [...prev, { id: uuidv4(), url: linkText }]);
        setLinkText("");
    };

    const addTask = () => {
        if (!taskText) return;
        setTasks((prev) => [...prev, { id: uuidv4(), task: taskText, completed: false }]);
        setTaskText("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create the project
            const { data: project, error: projectError } = await supabase
                .from("project")
                .insert({
                    name: projectName,
                    description,
                })
                .select()
                .single();

            if (projectError) {
                throw new Error(projectError.message);
            }

            const projectId = project.id;

            // Add files
            if (files.length > 0) {
                const fileData = files.map((file) => ({
                    id: uuidv4(),
                    name: file.name,
                    url: file.url,
                    projectId,
                    uploadedAt: new Date().toISOString()
                }));
                const { error: fileError } = await supabase.from("file").insert(fileData);
                if (fileError) console.error("File insert error:", fileError.message);
            }

            // Add links
            if (links.length > 0) {
                const linkData = links.map((link) => ({
                    id: uuidv4(),
                    url: link.url,
                    projectId,
                    createdAt: new Date().toISOString(),

                }));
                const { error: linkError } = await supabase.from("link").insert(linkData);
                if (linkError) console.error("Link insert error:", linkError.message);
            }

            // Add tasks
            if (tasks.length > 0) {
                const taskData = tasks.map((task) => ({
                    id: uuidv4(),
                    task: task.task,
                    completed: task.completed,
                    projectId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }));
                const { error: taskError } = await supabase.from("task").insert(taskData);
                if (taskError) console.error("Task insert error:", taskError.message);
            }

            alert("Project created successfully!");
        } catch (error) {
            console.error("Error submitting form:", error.message);
            alert("An error occurred while creating the project.");
        }
    };

    return (
        <RootLayout>
            <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
                <header className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">CollabMate</h1>
                    <DarkModeToggle />
                </header>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold mb-2">Project Name</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter project name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter project description"
                            rows="3"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-lg font-semibold mb-2">Upload Files</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                            className="w-full"
                        />
                        <ul className="mt-4">
                            {files.map(({ id, name }) => (
                                <li key={id} className="py-2 border-b">
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label className="block text-lg font-semibold mb-2">Add Links</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                                className="flex-1 p-2 border rounded"
                                placeholder="Enter a URL"
                            />
                            <button
                                type="button"
                                onClick={addLink}
                                className="p-2 bg-blue-500 text-white rounded"
                            >
                                Add
                            </button>
                        </div>
                        <ul className="mt-4">
                            {links.map(({ id, url }) => (
                                <li key={id} className="py-2 border-b">
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label className="block text-lg font-semibold mb-2">Add Tasks</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={taskText}
                                onChange={(e) => setTaskText(e.target.value)}
                                className="flex-1 p-2 border rounded"
                                placeholder="Enter a task"
                            />
                            <button
                                type="button"
                                onClick={addTask}
                                className="p-2 bg-green-500 text-white rounded"
                            >
                                Add
                            </button>
                        </div>
                        <ul className="mt-4">
                            {tasks.map(({ id, task, completed }) => (
                                <li key={id} className="py-2 border-b flex items-center gap-2">
                                    <span className={completed ? "line-through" : ""}>{task}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                        Create Project
                    </button>
                </form>
            </div>
        </RootLayout>
    );
};

export default Home;
