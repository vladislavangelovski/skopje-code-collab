"use client";
import React, { useState } from 'react';

const LinkManager = ({ links, addLink }) => {
    const [url, setUrl] = useState('');

    const handleAddLink = () => {
        if (url) {
            addLink(url);
            setUrl('');
        }
    };

    return (
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Add Links</h2>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter a URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={handleAddLink}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
        </section>
    );
};

export default LinkManager;