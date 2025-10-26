import React, { useState } from 'react';
import { signUp, logIn, logInWithGoogle } from '../services/authService';

export const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await logIn(email, password);
            } else {
                await signUp(email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await logInWithGoogle();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#110d18] to-black p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-sky-400">
                        Welcome to ThumbGenius
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {isLogin ? 'Sign in to continue' : 'Create an account to get started'}
                    </p>
                </div>
                
                {error && <p className="bg-red-900/50 text-red-300 text-center p-3 rounded-md mb-4 text-sm">{error}</p>}
                
                <form onSubmit={handleAuthAction} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-white/5 border-2 border-white/10 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-200"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-white/5 border-2 border-white/10 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-200"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-lg hover:from-fuchsia-700 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-105"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>
                
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3 bg-white/10 border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C44.599,35.536,48,29.42,48,24C48,22.659,47.862,21.35,47.611,20.083z"></path></svg>
                    Sign in with Google
                </button>
                
                <p className="text-center text-sm text-gray-400 mt-8">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-purple-400 hover:text-purple-300 ml-1">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};
