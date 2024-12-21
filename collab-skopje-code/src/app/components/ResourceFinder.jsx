"use client";
import React, { useState } from 'react';
import axios from 'axios';

const ResourceFinder = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const fetchResources = async () => {
        if (!searchQuery) {
            setError('Search query is required.');
            return;
        }
        setError('');
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
            setError('Error fetching resources. Please try again.');
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
                <button
                    onClick={fetchResources}
                    className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                    Search
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <ul className="mt-4">
                {searchResults.map((result) => (
                    <li key={result.id.videoId} className="py-2 border-b">
                        <a
                            href={`https://www.youtube.com/watch?v=${result.id.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-500 underline"
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
