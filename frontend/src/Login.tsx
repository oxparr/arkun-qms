import { useState } from 'react';
import { useAuth } from './lib/auth';
import api from './lib/api';
import { Cpu, User, Key, AlertTriangle, Info } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState('user1'); // Default to manager
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', { username, password });
            login(res.data.token, res.data.user);
        } catch (e) {
            setError('ACCESS DENIED: Invalid Credentials');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-slate-300 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 pattern-grid-slate-800 opacity-20 pointer-events-none" />

            <div className="w-full max-w-md rounded-lg border border-slate-700/50 bg-slate-900/60 p-8 backdrop-blur-md relative z-10 shadow-2xl">
                <div className="flex flex-col items-center justify-center mb-8">
                    <Cpu className="w-12 h-12 text-emerald-400 animate-pulse" />
                    <h1 className="mt-4 text-center text-2xl font-bold text-white tracking-tight">ARKUN</h1>
                    <p className="mt-2 text-sm text-slate-400 font-mono">Secure Access Portal</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-500 p-3 rounded flex items-center gap-2 text-sm font-bold animate-pulse">
                        <AlertTriangle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-slate-500 ml-1" htmlFor="operator_id">
                            Operator ID
                        </label>
                        <div className="relative mt-2 group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors w-5 h-5" />
                            <input
                                id="operator_id"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-md border border-slate-700/50 bg-slate-950/50 p-3 pl-10 font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                                placeholder="ID-74B-X1"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-slate-500 ml-1" htmlFor="password">
                            Security Key
                        </label>
                        <div className="relative mt-2 group">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors w-5 h-5" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md border border-slate-700/50 bg-slate-950/50 p-3 pl-10 font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center text-sm justify-end">
                        <a href="#" className="font-medium text-emerald-500 hover:text-emerald-400 transition-colors">Forgot Security Key?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-emerald-600 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-emerald-glow transition-all hover:bg-emerald-500 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {isLoading ? 'Verifying Credentials...' : 'Authenticate'}
                    </button>

                    <div className="flex items-start gap-3 rounded-md border border-cyan-500/30 bg-cyan-500/10 p-3 mt-6">
                        <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                            <p className="font-bold text-cyan-500 text-sm">Demo Access</p>
                            <p className="text-xs text-slate-400 mt-1">For presentation purposes, you can log in using Operator ID: <span className="font-mono text-cyan-400">admin</span> and any Security Key.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 mt-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                            <p className="font-bold text-amber-500 text-sm">Warning: High Security Zone</p>
                            <p className="text-xs text-slate-400 mt-1">Unauthorized access is strictly prohibited and will be logged.</p>
                        </div>
                    </div>
                </form>
            </div>

            <p className="mt-8 text-center text-xs text-slate-600 font-mono">
                System Version: 2.1.0-alpha | Connection Status: <span className="text-emerald-500 font-bold glow">SECURE</span>
            </p>
        </div>
    );
}
