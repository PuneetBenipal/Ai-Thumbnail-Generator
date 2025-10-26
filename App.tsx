import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { History } from './components/History';

type View = 'generator' | 'history';

const App: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [view, setView] = useState<View>('generator');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#110d18]">
        <div className="relative flex items-center justify-center h-20 w-20">
          <div className="absolute h-full w-full rounded-full border-2 border-purple-500/50"></div>
          <div className="absolute h-full w-full rounded-full border-t-2 border-purple-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110d18] to-black text-gray-200">
      {currentUser ? (
        <>
          <Header view={view} setView={setView} />
          {view === 'generator' && <Dashboard />}
          {view === 'history' && <History />}
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
};

export default App;
