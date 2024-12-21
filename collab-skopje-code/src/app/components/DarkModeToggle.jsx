"use client";
import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Sync with localStorage and apply dark mode on initial load
    useEffect(() => {
        const savedMode = localStorage.getItem("dark-mode") === "true";
        setIsDarkMode(savedMode);
        document.documentElement.classList.toggle("dark", savedMode);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem("dark-mode", newMode);
            document.documentElement.classList.toggle("dark", newMode);
            return newMode;
        });
    };

    return (
        <button
            onClick={toggleDarkMode}
            className={`p-2 rounded ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
            }`}
        >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
    );
};

export default DarkModeToggle;
