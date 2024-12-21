import React, { useEffect, useState } from "react";
import prisma from "@prisma/client";

const LinkManager = ({ projectId }) => {
    const [links, setLinks] = useState([]);
    const [url, setUrl] = useState("");

    const fetchLinks = async () => {
        const fetchedLinks = await prisma.link.findMany({
            where: { projectId },
        });
        setLinks(fetchedLinks);
    };

    const addLink = async () => {
        if (!url) return;

        const newLink = await prisma.link.create({
            data: {
                url,
                projectId,
            },
        });

        setLinks((prev) => [...prev, newLink]);
        setUrl("");
    };

    useEffect(() => {
        fetchLinks();
    }, []);

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
        </section>
    );
};

export default LinkManager;
