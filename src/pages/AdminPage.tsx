import React, { useState } from 'react';
import { Page } from '../types';
import { useAuth } from '../context/AuthContext';
import { getToken } from '../services/apiService';

interface AdminPageProps {
    setPage: (page: Page) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ setPage }) => {
    const { user } = useAuth();

    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // Protect the route loosely on the frontend.
    // The backend absolutely protects the actual functionality via get_current_admin_user.
    if (!user || user.email !== 'admin_ben@cultofthefork.tech') {
        return (
            <div className="w-full h-full flex items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-3xl font-bold text-red-500 mb-4 font-mono">ACCESS_DENIED</h1>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Your clearance level is insufficient to access the sysadmin terminal.
                    </p>
                    <button
                        onClick={() => setPage('Daily')}
                        className="px-6 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/50 rounded hover:bg-purple-600/40 font-mono transition-colors"
                    >
                        [ RETURN_TO_DECK ]
                    </button>
                </div>
            </div>
        );
    }

    const handleAddStardust = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || amount === 0) return;

        setStatus('loading');
        setMessage('');

        try {
            const PORT = import.meta.env.VITE_APP_API_PORT || 8000;
            const API_URL = `http://localhost:${PORT}`;

            const response = await fetch(`${API_URL}/api/admin/add-stardust`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    user_email: email,
                    amount: amount
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to add stardust');
            }

            setStatus('success');
            setMessage(`Successfully added ${amount} stardust to ${email}.`);
            setEmail('');
            setAmount(0);
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setMessage(err.message || 'An error occurred.');
        }
    };

    return (
        <div className="w-full h-full overflow-y-auto p-4 sm:p-8 pt-20">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full border border-purple-500/30 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold font-mono text-purple-300">ADMIN_TERMINAL</h1>
                    <p className="text-gray-400">Manage user resources and system state.</p>
                </div>

                {/* Stardust Form Component */}
                <div className="bg-black/40 border border-purple-500/20 backdrop-blur-md rounded-xl p-6">
                    <h2 className="text-xl font-bold font-mono text-purple-400 mb-6 flex items-center gap-2">
                        <span>[*]</span> INJECT_STARDUST
                    </h2>

                    <form onSubmit={handleAddStardust} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-mono text-gray-400">TARGET_USER_EMAIL</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seeker@gridpunk.local"
                                className="w-full bg-black/60 border border-purple-500/30 rounded p-3 text-white focus:outline-none focus:border-purple-500 font-mono transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-mono text-gray-400">STARDUST_AMOUNT</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="500"
                                className="w-full bg-black/60 border border-purple-500/30 rounded p-3 text-white focus:outline-none focus:border-purple-500 font-mono transition-colors"
                                required
                            />
                        </div>

                        {status === 'success' && (
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded text-green-400 font-mono text-sm">
                                [+] {message}
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-sm">
                                [-] ERROR: {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {status === 'loading' ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>EXECUTING...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                    </svg>
                                    <span>EXECUTE_INJECTION</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
