import React from "react";
import Dropzone from "react-dropzone";

const FileUploader = ({ onDrop, files }) => (
    <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload Files</h2>
        <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
                <div
                    {...getRootProps()}
                    className="border-2 border-dashed p-4 text-center cursor-pointer bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <input {...getInputProps()} />
                    <p>Drag and drop files here, or click to select files</p>
                </div>
            )}
        </Dropzone>
        <ul className="mt-4 space-y-2">
            {files.map(({ id, file }) => (
                <li
                    key={id}
                    className="py-2 px-4 border rounded bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm"
                >
                    {file.name}
                </li>
            ))}
        </ul>
    </section>
);

export default FileUploader;
