import React from 'react';

function TopBar() {
    return (
        <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-300 flex items-center justify-between p-4 z-10">
            <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Mega City" width={40} className="h-10" />
                <h2 className="font-bold text-xl text-black">Mega City</h2>
            </div>
        </div>
    );
}

export default TopBar;