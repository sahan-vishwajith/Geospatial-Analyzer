// src/components/layout/Sidebar.tsx - Final version with Hover Submenu

import React, { useState } from 'react';
import { BeakerIcon, GlobeAltIcon, Cog6ToothIcon, EnvelopeIcon, InformationCircleIcon, ChevronDownIcon, PhotoIcon, CloudIcon } from '../icons/Icons';

type ViewType = 'satellite-analysis' | 'drone-analysis' | 'settings' | 'contact' | 'about';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const NavItem = ({ icon, text, isActive, onClick, isSidebarOpen }: { icon: JSX.Element; text: string; isActive: boolean; onClick: () => void; isSidebarOpen: boolean; }) => (
  <li>
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className={`flex items-center p-3 rounded-lg text-base font-normal transition-colors duration-200 ${isActive ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
      <div className="w-6 h-6 flex-shrink-0">{icon}</div>
      {isSidebarOpen && <span className="ml-3 whitespace-nowrap">{text}</span>}
    </a>
  </li>
);

const NavItemWithSubmenu = ({ icon, text, children, isSidebarOpen }: { icon: JSX.Element; text: string; children: React.ReactNode; isSidebarOpen: boolean; }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const canOpenSubmenu = isSidebarOpen;

  return (
    <li onMouseEnter={() => canOpenSubmenu && setIsSubmenuOpen(true)} onMouseLeave={() => setIsSubmenuOpen(false)}>
      <div className={`flex items-center justify-between p-3 rounded-lg text-base font-normal text-gray-300 hover:bg-gray-700 cursor-pointer`}>
        <div className="flex items-center">
            <div className="w-6 h-6 flex-shrink-0">{icon}</div>
            {isSidebarOpen && <span className="ml-3 whitespace-nowrap">{text}</span>}
        </div>
        {isSidebarOpen && <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`} />}
      </div>
      {isSubmenuOpen && canOpenSubmenu && (
        <ul className="py-2 space-y-2 pl-8">
            {children}
        </ul>
      )}
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, onToggle }) => {
  return (
    <aside className={`flex-shrink-0 transition-all duration-300 bg-gray-800 border-r border-gray-700 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="h-full px-3 py-4 flex flex-col">

        <button onClick={onToggle} className="flex items-center w-full mb-5 text-left p-2">
            <div className="w-8 h-8 flex-shrink-0"><GlobeAltIcon className="text-cyan-400" /></div>
            {isOpen && (
              <div className="ml-3">
                <span className="block text-lg font-semibold whitespace-nowrap text-white leading-tight">Geo-Spatial</span>
                <span className="block text-sm font-semibold whitespace-nowrap text-gray-300 leading-tight">Analyzer</span>
              </div>
            )}
        </button>

        <ul className="space-y-2 flex-1">
          <NavItem icon={<InformationCircleIcon />} text="About Us" isActive={currentView === 'about'} onClick={() => setCurrentView('about')} isSidebarOpen={isOpen} />

          <NavItemWithSubmenu icon={<BeakerIcon />} text="Analysis" isSidebarOpen={isOpen}>
            <NavItem icon={<CloudIcon />} text="Satellite Images" isActive={currentView === 'satellite-analysis'} onClick={() => setCurrentView('satellite-analysis')} isSidebarOpen={isOpen} />
            <NavItem icon={<PhotoIcon />} text="Time Lapse" isActive={currentView === 'drone-analysis'} onClick={() => setCurrentView('drone-analysis')} isSidebarOpen={isOpen} />
          </NavItemWithSubmenu>

          <NavItem icon={<Cog6ToothIcon />} text="Settings" isActive={currentView === 'settings'} onClick={() => setCurrentView('settings')} isSidebarOpen={isOpen} />
          <NavItem icon={<EnvelopeIcon />} text="Contact Us" isActive={currentView === 'contact'} onClick={() => setCurrentView('contact')} isSidebarOpen={isOpen} />
        </ul>

        <div className={`text-center text-xs text-gray-500 p-4 whitespace-nowrap overflow-hidden`}>
            {isOpen && <p>© {new Date().getFullYear()} Geo-Spatial Analyzer</p>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
