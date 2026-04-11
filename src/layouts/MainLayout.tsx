import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <ErrorBoundary>
            <div className="max-w-[1400px] mx-auto animate-fade-in-up">
              {children}
            </div>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
