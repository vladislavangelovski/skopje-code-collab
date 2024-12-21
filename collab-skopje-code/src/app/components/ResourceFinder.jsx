"use client"
import React, { useState } from 'react';
import axios from 'axios';

const ResourceFinder = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const fetchResources = async () => {
        if (!searchQuery) {
            console.error("Search query is empty!");
            return;
        }
        try {
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search`,
                {
                    params: {
                        q: searchQuery,
                        part: 'snippet',
                        maxResults: 5,
                        key: 'YOUR_YOUTUBE_API_KEY',
                    },
                }
            );
            setSearchResults(response.data.items);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    return (
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Resource Finder</h2>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search for resources"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
                <button onClick={fetchResources} className="p-2 bg-purple-500 text-white rounded">
                    Search
                </button>
            </div>
            <ul className="mt-4">
                {searchResults.map((result) => (
                    <li key={result.id.videoId} className="py-2 border-b">
                        <a
                            href={`https://www.youtube.com/watch?v=${result.id.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-500"
                        >
                            {result.snippet.title}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ResourceFinder;