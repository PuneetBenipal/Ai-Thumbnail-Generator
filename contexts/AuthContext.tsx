import React, { useContext, useState, useEffect, createContext, useCallback } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../services/firebaseConfig";
import { getUserProfile } from "../services/firestoreService";
import type { UserProfile } from "../types";


interface AuthContextType {
    currentUser: FirebaseUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
    deductCredit: () => void;
    addCredits: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType>({ 
    currentUser: null, 
    userProfile: null,
    loading: true,
    deductCredit: () => {},
    addCredits: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Run in demo mode
      setCurrentUser({ uid: 'demo-user' } as FirebaseUser); // Mock user
      setUserProfile({ email: 'demo@example.com', credits: 99 });
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const deductCredit = useCallback(() => {
    setUserProfile(prevProfile => {
        if (!prevProfile) return null;
        return { ...prevProfile, credits: Math.max(0, prevProfile.credits - 1) };
    });
  }, []);

  const addCredits = useCallback((amount: number) => {
    setUserProfile(prevProfile => {
        if (!prevProfile) return null;
        return { ...prevProfile, credits: prevProfile.credits + amount };
    });
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    deductCredit,
    addCredits,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};