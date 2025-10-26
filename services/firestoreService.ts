import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db, isFirebaseConfigured, auth } from "./firebaseConfig";
import type { GeneratedContent, UserProfile, PastGeneration } from "../types";
import { User } from "firebase/auth";


const ensureConfigured = () => {
    if (!isFirebaseConfigured || !db || !auth) {
        // Silently fail in demo mode, as expected.
        return false;
    }
    return true;
};

// User Profile Management
export const createUserProfile = async (user: User) => {
    if (!ensureConfigured() || !user) return;
    const userRef = doc(db, "users", user.uid);
    
    // Check if the user document already exists to prevent overwriting
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        await setDoc(userRef, {
            email: user.email,
            credits: 3 // Starting credits for new users
        });
    }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!ensureConfigured()) return null;
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    } else {
        return null;
    }
};

export const deductCredit = async (userId: string) => {
    if (!ensureConfigured()) return;
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        credits: increment(-1)
    });
};

export const addCredits = async (userId: string, amount: number) => {
    if (!ensureConfigured() || amount <= 0) return;
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        credits: increment(amount)
    });
};


// Generation History Management
export const saveGeneration = async (data: GeneratedContent & {prompt: string}) => {
    if (!ensureConfigured() || !auth.currentUser) return;
    try {
        await addDoc(collection(db, "generations"), {
            ...data,
            userId: auth.currentUser.uid,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving generation to Firestore:", error);
        throw new Error("Could not save generation.");
    }
};

export const getGenerations = async (): Promise<PastGeneration[]> => {
    if (!ensureConfigured() || !auth.currentUser) return [];
    try {
        const q = query(
            collection(db, "generations"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const generations: PastGeneration[] = [];
        querySnapshot.forEach((doc) => {
            generations.push({ id: doc.id, ...doc.data() } as PastGeneration);
        });
        return generations;
    } catch (error) {
        console.error("Error fetching generations from Firestore:", error);
        throw new Error("Could not fetch past generations.");
    }
};