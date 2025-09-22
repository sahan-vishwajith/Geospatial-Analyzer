// src/components/layout/DashboardLayout.tsx

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from '../Header';
import AnalysisView from '../views/AnalysisView';
import TimeLapse from '../views/TimeLapse'; // renamed component
import SettingsView from '../views/SettingsView';
import ContactView from '../views/ContactView';
import AboutView from '../views/AboutView';

type ViewType = 'satellite-analysis' | 'drone-analysis' | 'settings' | 'contact' | 'about';

interface DashboardLayoutProps {
  onLogout: () => void;
}

const viewConfig = {
    'satellite-analysis': { title: 'Satellite Image Analysis', Component: AnalysisView },
    'drone-analysis': { title: 'Time Lapse Analysis', Component: TimeLapse },
    settings: { title: 'Settings', Component: SettingsView },
    contact: { title: 'Contact Us', Component: ContactView },
    about: { title: 'About Us', Component: AboutView },
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<ViewType>('about'); // default page after login
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { title, Component } = viewConfig[currentView];

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} title={title} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
            <div className="p-4 sm:p-6 lg:p-8">
                <Component />
            </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
