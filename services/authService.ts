import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut,
    getAdditionalUserInfo
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebaseConfig";
import { createUserProfile } from "./firestoreService";

export const signUp = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
        return Promise.reject(new Error("Firebase is not configured. Please add your credentials."));
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user);
    return userCredential;
};

export const logIn = (email, password) => {
    if (!isFirebaseConfigured || !auth) {
        return Promise.reject(new Error("Firebase is not configured. Please add your credentials."));
    }
    return signInWithEmailAndPassword(auth, email, password);
};

export const logInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
        return Promise.reject(new Error("Firebase is not configured. Please add your credentials."));
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const additionalInfo = getAdditionalUserInfo(result);
    
    // If the user is new, create their profile with starting credits
    if (additionalInfo?.isNewUser) {
        await createUserProfile(result.user);
    }
    return result;
};

export const logOut = () => {
    if (!isFirebaseConfigured || !auth) {
        // In demo mode, this does nothing and prevents errors.
        console.warn("Attempted to log out in demo mode. Operation suppressed.");
        return Promise.resolve();
    }
    return signOut(auth);
};