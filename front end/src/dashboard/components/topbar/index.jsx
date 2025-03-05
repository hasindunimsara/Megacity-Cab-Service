import React from 'react';

function TopBar() {
    return (
        <div className="bg-white text-white w-full flex items-center justify-between border-b-[0.5px] border-gray-300 p-4">
            <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="nts" width={50} />
                <h2 className="font-bold text-2xl text-black">Smart Seat Reservation System</h2>
            </div>
        </div>
    );
}

export default TopBar;
