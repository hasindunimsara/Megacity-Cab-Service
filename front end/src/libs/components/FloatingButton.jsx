import React from 'react';
import { Plus } from 'lucide-react'; // Using Lucide for icons

const FloatingButton = ({
    onClick,
    icon: Icon = Plus,
    className = '',
    position = 'bottom-6 right-6',
    bgColor = 'bg-black',
    hoverColor = 'hover:bg-gray-900'
}) => {
    return (
        <button
            onClick={onClick}
            className={`
        fixed ${position} 
        ${bgColor} ${hoverColor}
        text-white 
        rounded-full 
        w-14 h-14 
        flex items-center justify-center 
        shadow-lg 
        z-50 
        transition-all 
        duration-300 
        hover:scale-110 
        focus:outline-none
        ${className}
      `}
        >
            <Icon className="w-6 h-6" />
        </button>
    );
};

export default FloatingButton;