import React, { useState } from 'react';
import { X } from 'lucide-react';

const SiderLayout = ({
    isOpen,
    onClose,
    children,
    position = 'right',
    width = 'w-96',
    overlayClassName = '',
    sidebarClassName = ''
}) => {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className={`
            fixed 
            inset-0 
            bg-black 
            bg-opacity-50 
            z-40 
            transition-opacity 
            duration-300 
            ${overlayClassName}
          `}
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
          fixed 
          top-0 
          ${position === 'right' ? 'right-0' : 'left-0'}
          ${width}
          h-full 
          bg-white 
          shadow-lg 
          z-50 
          transform 
          transition-transform 
          duration-300 
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${sidebarClassName}
          ${isOpen ? 'overflow-auto' : 'overflow-hidden'}
        `}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="
            absolute 
            top-4 
            right-4 
            text-gray-600 
            hover:text-gray-900 
            focus:outline-none
          "
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Content */}
                <div className="p-6 pt-6">
                    {children}
                </div>
            </div>
        </>
    );
};

export default SiderLayout;