"use client";
import React, { useState } from "react";
import DarkModeToggle from "@/app/components/DarkModeToggle";
import FileUploader from "@/app/components/FileUploader";
import LinkManager from "@/app/components/LinkManager";
import ToDoList from "@/app/components/ToDoList";
import ResourceFinder from "@/app/components/ResourceFinder";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid"; // Ensure uuid is imported

const supabase = createClient(
    "https://qxqtexexyddetbaakplu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4cXRleGV4eWRkZXRiYWFrcGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NzQxMjgsImV4cCI6MjA1MDM1MDEyOH0.x2ddzmxImqS_H2jy7nPA41R0ExdLbfTyPxses6YLXLo"
);

const Home = () => {
    const [files, setFiles] = useState([]);
    const [links, setLinks] = useState([]);
    const [tasks, setTasks] = useState([]);

    const handleFileUpload = async (acceptedFiles) => {
        try {
            const uploadedFiles = await Promise.all(
                acceptedFiles.map(async (file) => {
                    const { data, error } = await supabase.storage
                        .from("uploads") // Replace 'uploads' with your bucket name
                        .upload(`uploaded-files/${file.name}`, file); // Optional folder

                    if (error) {
                        console.error("File upload error:", error.message);
                        return null;
                    }

                    // Generate public URL for the uploaded file
                    const { publicUrl } = supabase.storage
                        .from("uploads")
                        .getPublicUrl(`uploaded-files/${file.name}`);

                    return { id: uuidv4(), file: file.name, url: publicUrl };
                })
            );

            setFiles((prev) => [...prev, ...uploadedFiles.filter(Boolean)]);
        } catch (error) {
            console.error("Error during file upload:", error);
        }
    };

    const addLink = (url) => {
        if (!url) return;
        setLinks((prev) => [...prev, { id: uuidv4(), url }]);
    };

    const addTask = (task) => {
        if (!task) return;
        setTasks((prev) => [...prev, { id: uuidv4(), task, completed: false }]);
    };

    const toggleTaskCompletion = (id) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold px-4 py-2 rounded-lg">
                    CollabMate
                </h1>
                <DarkModeToggle />
            </header>
            <main className="space-y-6">
                <FileUploader onDrop={handleFileUpload} files={files} />
                <LinkManager links={links} addLink={addLink} />
                <ToDoList
                    tasks={tasks}
                    addTask={addTask}
                    toggleTaskCompletion={toggleTaskCompletion}
                />
                <ResourceFinder />
            </main>
        </div>
    );
};

export default Home;
