"use client"
import Image from "next/image";
import React, { useState } from "react";
import DarkModeToggle from '@/app/components/DarkModeToggle'
import FileUploader from '@/app/components/FileUploader';
import LinkManager from '@/app/components/LinkManager';
import ToDoList from "@/app/components/ToDoList";
import ResourceFinder from "@/app/components/ResourceFinder";
import { createClient } from '@supabase/supabase-js';
import RootLayout from "@/app/layout";

const supabase = createClient("https://qxqtexexyddetbaakplu.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4cXRleGV4eWRkZXRiYWFrcGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NzQxMjgsImV4cCI6MjA1MDM1MDEyOH0.x2ddzmxImqS_H2jy7nPA41R0ExdLbfTyPxses6YLXLo');

const Home = () => {
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([]);
  const [tasks, setTasks] = useState([]);

  const handleFileUpload = async (acceptedFiles) => {
    try {
      const uploadedFiles = await Promise.all(
          acceptedFiles.map(async (file) => {
            const { data, error } = await supabase.storage
                .from('uploads') // Replace 'uploads' with your bucket name
                .upload(`your-folder/${file.name}`, file); // Optional folder

            if (error) {
              console.error('File upload error:', error.message);
              return null;
            }

            return { id: uuidv4(), file: file.name, url: data.path };
          })
      );

      setFiles((prev) => [...prev, ...uploadedFiles.filter(Boolean)]);
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  return (
      <RootLayout>


        <div className="min-h-screen p-4">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold bg-amber-400">CollabMate</h1>
            <DarkModeToggle/>
          </header>
          <FileUploader onDrop={handleFileUpload} files={files}/>
          <LinkManager links={links} addLink={(url) => setLinks([...links, {id: uuidv4(), url}])}/>
          <ToDoList
              tasks={tasks}
              addTask={(task) => setTasks([...tasks, {id: uuidv4(), task, completed: false}])}
              toggleTaskCompletion={(id) =>
                  setTasks((prev) =>
                      prev.map((task) => (task.id === id ? {...task, completed: !task.completed} : task))
                  )
              }
          />
          <ResourceFinder/>
        </div>
      </RootLayout>
  );
};

export default Home;
