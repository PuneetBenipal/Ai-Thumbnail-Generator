import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../services/authService';
import { addCredits as addCreditsService } from '../services/firestoreService';
import { isFirebaseConfigured } from '../services/firebaseConfig';

// Make Paddle available on the window object
declare const Paddle: any;

interface HeaderProps {
    view: 'generator' | 'history';
    setView: (view: 'generator' | 'history') => void;
}


export const Header: React.FC<HeaderProps> = ({ view, setView }) => {
  const { currentUser, userProfile, addCredits } = useAuth();
  const [paddle, setPaddle] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && isFirebaseConfigured) {
        const PADDLE_CLIENT_TOKEN = "YOUR_PADDLE_CLIENT_SIDE_TOKEN";
        if (PADDLE_CLIENT_TOKEN && PADDLE_CLIENT_TOKEN !== "YOUR_PADDLE_CLIENT_SIDE_TOKEN") {
             Paddle.Environment.set('sandbox');
             Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN })
                .then((paddleInstance: any) => setPaddle(paddleInstance))
                .catch((error: any) => console.error("Error initializing Paddle:", error));
        }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleGetMoreCredits = () => {
    if (!paddle || !currentUser) return;
    const PADDLE_PRICE_ID = 'YOUR_PADDLE_PRICE_ID';

    if (PADDLE_PRICE_ID === 'YOUR_PADDLE_PRICE_ID') {
        alert("Paddle payments are not fully configured. Please replace the placeholder `PADDLE_PRICE_ID` in `components/Header.tsx`.");
        return;
    }

    paddle.Checkout.open({
        items: [{ priceId: PADDLE_PRICE_ID, quantity: 1 }],
        customer: { email: currentUser.email || undefined },
        customData: { userId: currentUser.uid },
        events: {
            onCheckout: (data: any) => {
                if (data.name === 'checkout.completed') {
                    const CREDITS_TO_ADD = 50;
                    addCreditsService(currentUser.uid, CREDITS_TO_ADD);
                    addCredits(CREDITS_TO_ADD);
                }
            }
        }
    });
  };

  const isPurchaseDisabled = !paddle || !isFirebaseConfigured;

  return (
    <header className="py-2 px-8 bg-black/20 backdrop-blur-sm border-b border-white/10 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-sky-400">
                ThumbGenius
            </h1>
            <nav className="bg-white/5 p-1 rounded-lg flex items-center gap-1">
                <button 
                    onClick={() => setView('generator')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === 'generator' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                >
                    Generator
                </button>
                 <button 
                    onClick={() => setView('history')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === 'history' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                >
                    History
                </button>
            </nav>
        </div>
      {currentUser && (
        <div className="flex items-center gap-4">
           {userProfile && (
            <div className="flex items-center gap-4">
                <div className="text-center">
                    <div className="text-sm font-bold text-white">{userProfile.credits}</div>
                    <div className="text-xs text-gray-400">Credits</div>
                </div>
                 <button 
                    onClick={handleGetMoreCredits}
                    disabled={isPurchaseDisabled}
                    className="px-3 py-1.5 bg-green-600/20 text-green-300 text-xs font-semibold rounded-md border border-green-500/30 hover:bg-green-600/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isPurchaseDisabled ? "Payments are not configured" : "Purchase 50 credits"}
                 >
                    Get More Credits
                </button>
            </div>
          )}
          <span className="text-sm text-gray-300 hidden xl:block">{currentUser.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 transition-colors"
          >
            Log Out
          </button>
        </div>
      )}
    </header>
  );
};
