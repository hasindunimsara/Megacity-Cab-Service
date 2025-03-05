import React from 'react';
import { X } from 'lucide-react';

const Popup = ({
    isOpen,
    onClose,
    title,
    children,
    width = 'max-w-md',
    height = 'auto',
    className = ''
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`relative bg-white rounded-lg shadow-xl p-6 ${width} ${height} ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Title */}
                {title && (
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {title}
                    </h2>
                )}

                {/* Content */}
                <div className="mt-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;