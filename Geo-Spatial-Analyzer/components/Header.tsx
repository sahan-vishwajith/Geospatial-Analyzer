import React from 'react';
import { ArrowRightOnRectangleIcon } from './icons/Icons';

interface HeaderProps {
    onLogout: () => void;
    title: string;
}

const Header: React.FC<HeaderProps> = ({ onLogout, title }) => {
    return (
        <header className="bg-gray-800/80 backdrop-blur-sm shadow-md border-b border-gray-700 sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <h1 className="text-2xl font-bold text-white">
                        {title}
                    </h1>
                    <div className="flex items-center space-x-4">
                         <button
                            onClick={onLogout}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition duration-300"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;