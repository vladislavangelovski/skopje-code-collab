import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import prisma from "@prisma/client";
 // Import Prisma Client

const FileUploader = ({ projectId }) => {
    const [files, setFiles] = useState([]);

    // Fetch files from the database
    const fetchFiles = async () => {
        const fetchedFiles = await prisma.file.findMany({
            where: { projectId },
        });
        setFiles(fetchedFiles);
    };

    // Handle file upload
    const handleFileUpload = async (acceptedFiles) => {
        const uploadedFiles = await Promise.all(
            acceptedFiles.map(async (file) => {
                // Upload the file to Supabase Storage
                const { data, error } = await supabase.storage
                    .from("uploads") // Replace with your bucket name
                    .upload(`uploaded-files/${file.name}`, file);

                if (error) {
                    console.error("Error uploading file to Supabase:", error.message);
                    return null;
                }

                // Generate the public URL for the uploaded file
                const { publicUrl } = supabase.storage
                    .from("uploads")
                    .getPublicUrl(`uploaded-files/${file.name}`);

                return { name: file.name, url: publicUrl };
            })
        );

        // Update the state with the uploaded files
        setFiles((prev) => [...prev, ...uploadedFiles.filter(Boolean)]);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Upload Files</h2>
            <Dropzone onDrop={handleFileUpload}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed p-4 text-center cursor-pointer"
                    >
                        <input {...getInputProps()} />
                        <p>Drag and drop files here, or click to select files</p>
                    </div>
                )}
            </Dropzone>
            <ul className="mt-4">
                {files.map(({ id, name }) => (
                    <li key={id} className="py-2 border-b">
                        {name}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default FileUploader;
