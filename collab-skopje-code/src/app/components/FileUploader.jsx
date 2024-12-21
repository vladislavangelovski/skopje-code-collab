import React from 'react';
import Dropzone from 'react-dropzone';

const FileUploader = ({ onDrop, files }) => (
    <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload Files</h2>
        <Dropzone onDrop={onDrop}>
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
            {files.map(({ id, file }) => (
                <li key={id} className="py-2 border-b">{file.name}</li>
            ))}
        </ul>
    </section>
);

export default FileUploader;