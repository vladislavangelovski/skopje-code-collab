import React from 'react';
import useDarkMode from 'use-dark-mode';

const DarkModeToggle = () => {
    const darkMode = useDarkMode(false);
    return (
        <button onClick={darkMode.toggle} className="p-2 bg-gray-700 text-white rounded">
            Toggle {darkMode.value ? 'Light' : 'Dark'} Mode
        </button>
    );
};

export default DarkModeToggle;
